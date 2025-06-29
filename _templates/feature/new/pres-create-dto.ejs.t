---
to: src/presentation/modules/<%= kebabCase %>/dtos/create-<%= kebabCase %>-request.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Create<%= pascalCase %>Dto } from '../../../../application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case';

/**
 * Create <%= pascalCase %> Request DTO
 * 
 * This DTO validates and transfers data from the controller to the use case.
 * It's part of the presentation layer and includes validation rules.
 */
export class Create<%= pascalCase %>RequestDto implements Create<%= pascalCase %>Dto {
  @ApiProperty({
    description: 'The name of the <%= camelCase %>',
    example: 'Sample <%= pascalCase %>'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({
    description: 'The description of the <%= camelCase %> (optional)',
    example: 'This is a sample <%= camelCase %> description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  // Add additional properties with validation rules as needed
}
