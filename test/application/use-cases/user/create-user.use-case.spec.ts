import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/application/use-cases/user/dtos/create-user.dto';
import { UserAlreadyExistsException } from '@/domain/exceptions/user-already-exists.exception';

// Mock bcrypt for testing
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashed_password')),
}));

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: Partial<IUserRepository>;

  beforeEach(async () => {
    // Create mock repository
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should create a new user when the email is unique', async () => {
      // Arrange
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const createdUser = new User({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_password',
      });

      (mockUserRepository.create as jest.Mock).mockResolvedValue(createdUser);

      // Act
      const result = await createUserUseCase.execute(createUserDto);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: 'hashed_password',
        }),
      );
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw UserAlreadyExistsException when the email is already taken', async () => {
      // Arrange
      const existingUser = new User({
        id: '1',
        email: 'test@example.com',
        name: 'Existing User',
        passwordHash: 'existing_hash',
      });

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );

      // Act & Assert
      await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
