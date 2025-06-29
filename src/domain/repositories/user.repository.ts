import { User } from '../entities/user.entity';

/**
 * Repository interface for User entity.
 * Defines the contract that any User repository implementation must fulfill.
 */
export abstract class IUserRepository {
  /**
   * Find a user by their email address
   * @param email The email to search for
   * @returns A Promise that resolves to the User or null if not found
   */
  abstract findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user in the repository
   * @param user The user entity to create
   * @returns A Promise that resolves to the created User
   */
  abstract create(user: User): Promise<User>;
}
