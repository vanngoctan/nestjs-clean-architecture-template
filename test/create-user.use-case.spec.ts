import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/application/use-cases/user/dtos/create-user.dto';

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

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new user when email is not used', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const createdUser = new User({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_password123',
      });

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.create as jest.Mock).mockResolvedValue(createdUser);

      // Act
      const result = await createUserUseCase.execute(createUserDto);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw ConflictException when email is already used', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const existingUser = new User({
        id: '1',
        email: 'existing@example.com',
        name: 'Existing User',
        passwordHash: 'some_hash',
      });

      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );

      // Act & Assert
      await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
