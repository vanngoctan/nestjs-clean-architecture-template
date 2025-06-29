import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { UserModel } from '../models/user.model';

/**
 * MySQL implementation of the User repository.
 * This class implements the IUserRepository interface using TypeORM.
 */
@Injectable()
export class MySqlUserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  /**
   * Find a user by their email address
   * @param email The email to search for
   * @returns A Promise that resolves to the mapped domain User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userRepository.findOne({
      where: { email },
    });

    if (!userModel) {
      return null;
    }

    return this.mapToEntity(userModel);
  }

  /**
   * Create a new user in the repository
   * @param user The domain user entity to create
   * @returns A Promise that resolves to the created domain User
   */
  async create(user: User): Promise<User> {
    const userModel = this.userRepository.create({
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
    });

    const savedUserModel = await this.userRepository.save(userModel);
    return this.mapToEntity(savedUserModel);
  }

  /**
   * Map a UserModel from the database to a domain User entity
   * @param userModel The UserModel to map
   * @returns The mapped domain User
   */
  private mapToEntity(userModel: UserModel): User {
    return new User({
      id: userModel.id,
      email: userModel.email,
      name: userModel.name,
      passwordHash: userModel.passwordHash,
    });
  }
}
