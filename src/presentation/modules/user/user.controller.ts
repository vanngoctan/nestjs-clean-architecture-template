import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case';
import { FindUserByEmailUseCase } from '../../../application/use-cases/user/find-user-by-email.use-case';
import { CreateUserDto } from '../../../application/use-cases/user/dtos/create-user.dto';
import {
  CreateUserRequestDto,
  UserResponseDto,
} from './dtos/create-user-request.dto';
import { FeatureFlag } from '../../shared/decorators/feature-flag.decorator';
import { FeatureFlagGuard } from '../../shared/guards/feature-flag.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @FeatureFlag('new-user-endpoint')
  @UseGuards(FeatureFlagGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with the provided email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    // Map the HTTP request DTO to the use case DTO
    const createUserDto: CreateUserDto = {
      email: createUserRequestDto.email,
      name: createUserRequestDto.name,
      password: createUserRequestDto.password,
    };

    // Execute the use case
    const createdUser = await this.createUserUseCase.execute(createUserDto);

    // Return the response DTO
    return {
      id: createdUser.id.toString(),
      email: createdUser.email,
      name: createdUser.name,
    };
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // Cache for 60 seconds at the controller level
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    example: 'user@example.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
