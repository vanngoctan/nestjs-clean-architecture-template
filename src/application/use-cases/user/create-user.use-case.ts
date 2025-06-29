import { Injectable, Inject } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { CreateUserDto, CreatedUserDto } from './dtos/create-user.dto';
import { UserMetrics } from '../../../infrastructure/metrics/counters/user-metrics';
import * as bcrypt from 'bcrypt';

/**
 * Use case for creating a new user.
 * This implements the business logic for user creation.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,

    @InjectPinoLogger(CreateUserUseCase.name)
    private readonly logger: PinoLogger,

    private readonly userMetrics: UserMetrics,

    @InjectQueue('notification')
    private readonly notificationQueue: Queue,
  ) {}

  /**
   * Create a new user with the provided data
   * @param createUserDto The data for creating a user
   * @returns Promise resolving to the created user data
   * @throws ConflictException if a user with the email already exists
   */
  async execute(createUserDto: CreateUserDto): Promise<CreatedUserDto> {
    this.logger.debug({ email: createUserDto.email }, 'Creating new user');

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      this.logger.warn({ email: createUserDto.email }, 'User already exists');
      this.userMetrics.incrementUserAlreadyExists(createUserDto.email);
      this.userMetrics.incrementUserCreation('failure');
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    // Hash the password securely with bcrypt
    const saltRounds = 10;
    this.logger.debug('Hashing user password');
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create the user entity
    this.logger.debug('Creating user entity');
    const user = new User({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash: passwordHash,
    });

    // Save the user via the repository
    this.logger.debug('Saving user to repository');
    const createdUser = await this.userRepository.create(user);

    // Queue welcome email job asynchronously
    this.logger.debug('Queueing welcome email notification');
    await this.notificationQueue.add(
      'welcome-email',
      {
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );

    this.logger.info({ userId: createdUser.id }, 'User created successfully');
    this.userMetrics.incrementUserCreation('success');

    // Return the DTO with public information
    return {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    };
  }
}
