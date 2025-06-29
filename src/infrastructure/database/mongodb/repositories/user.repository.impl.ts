import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { UserMongoModel } from '../schemas/user.schema';

/**
 * MongoDB implementation of the User repository.
 * This class implements the IUserRepository interface using Mongoose.
 */
@Injectable()
export class MongoUserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserMongoModel.name)
    private userModel: Model<UserMongoModel>,
  ) {}

  /**
   * Find a user by their email address
   * @param email The email to search for
   * @returns A Promise that resolves to the mapped domain User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    return this.mapToEntity(user);
  }

  /**
   * Create a new user in the repository
   * @param user The domain user entity to create
   * @returns A Promise that resolves to the created domain User
   */
  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
    });

    const savedUser = await createdUser.save();
    return this.mapToEntity(savedUser);
  }

  /**
   * Map a UserMongoModel from the database to a domain User entity
   * @param userModel The UserMongoModel to map
   * @returns The mapped domain User
   */
  private mapToEntity(userModel: UserMongoModel): User {
    return new User({
      id: userModel._id!.toString(),
      email: userModel.email,
      name: userModel.name,
      passwordHash: userModel.passwordHash,
    });
  }
}
