import { Injectable, Inject } from "@nestjs/common";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";

/**
 * Use case for finding a user by email with caching.
 */
@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,

    @InjectPinoLogger(FindUserByEmailUseCase.name)
    private readonly logger: PinoLogger,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  /**
   * Find a user by email with cache-aside pattern
   * @param email The email to search for
   * @returns Promise resolving to the user or null if not found
   */
  async execute(email: string): Promise<User | null> {
    // Generate a cache key based on the email
    const cacheKey = `user:${email}`;

    // Try to get user from cache first
    this.logger.debug({ email }, "Checking cache for user");
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.debug({ email }, "User found in cache");
      return new User(cachedUser); // Convert plain object to User entity
    }

    // If not in cache, query the repository
    this.logger.debug({ email }, "User not in cache, checking repository");
    const user = await this.userRepository.findByEmail(email);

    // If found, store in cache for future requests
    if (user) {
      this.logger.debug(
        { email, userId: user.id },
        "User found in repository, storing in cache"
      );
      await this.cacheManager.set(cacheKey, user, 3600 * 1000); // Cache for 1 hour
    } else {
      this.logger.debug({ email }, "User not found");
      // Cache negative result to prevent repeated lookups for non-existent users
      // but with shorter TTL
      await this.cacheManager.set(cacheKey, null, 60 * 1000); // Cache for 1 minute
    }

    return user;
  }
}
