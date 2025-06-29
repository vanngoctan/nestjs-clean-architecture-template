---
to: src/presentation/modules/<%= kebabCase %>/<%= kebabCase %>.controller.ts
---
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Create<%= pascalCase %>UseCase } from '../../../application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case';
import { Get<%= pascalCase %>ByIdUseCase } from '../../../application/use-cases/<%= kebabCase %>/get-<%= kebabCase %>-by-id.use-case';
import { Create<%= pascalCase %>RequestDto } from './dtos/create-<%= kebabCase %>-request.dto';
import { <%= pascalCase %>ResponseDto } from './dtos/<%= kebabCase %>-response.dto';
import { Update<%= pascalCase %>RequestDto } from './dtos/update-<%= kebabCase %>-request.dto';

/**
 * <%= pascalCase %> Controller
 * 
 * Handles HTTP requests related to <%= camelCasePlural %>.
 * This is part of the presentation layer and maps between HTTP and application layer.
 */
@ApiTags('<%= pascalCasePlural %>')
@Controller('<%= kebabCasePlural %>')
export class <%= pascalCase %>Controller {
  constructor(
    private readonly create<%= pascalCase %>UseCase: Create<%= pascalCase %>UseCase,
    private readonly get<%= pascalCase %>ByIdUseCase: Get<%= pascalCase %>ByIdUseCase,
    // Inject other use cases here
  ) {}

  /**
   * Create a new <%= camelCase %>
   */
  @Post()
  @ApiOperation({ summary: 'Create a new <%= camelCase %>' })
  @ApiResponse({ 
    status: 201, 
    description: '<%= pascalCase %> created successfully',
    type: <%= pascalCase %>ResponseDto
  })
  async create(@Body() dto: Create<%= pascalCase %>RequestDto): Promise<<%= pascalCase %>ResponseDto> {
    const <%= camelCase %> = await this.create<%= pascalCase %>UseCase.execute(dto);
    return new <%= pascalCase %>ResponseDto(<%= camelCase %>);
  }

  /**
   * Get a <%= camelCase %> by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a <%= camelCase %> by ID' })
  @ApiResponse({ 
    status: 200, 
    description: '<%= pascalCase %> retrieved successfully',
    type: <%= pascalCase %>ResponseDto
  })
  @ApiResponse({ status: 404, description: '<%= pascalCase %> not found' })
  async getById(@Param('id') id: string): Promise<<%= pascalCase %>ResponseDto> {
    const <%= camelCase %> = await this.get<%= pascalCase %>ByIdUseCase.execute(id);
    return new <%= pascalCase %>ResponseDto(<%= camelCase %>);
  }

  // Implement other endpoints (GET all, UPDATE, DELETE) here
}
