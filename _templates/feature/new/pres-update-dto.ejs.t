---
to: src/presentation/modules/<%= kebabCase %>/dtos/update-<%= kebabCase %>-request.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Update <%= pascalCase %> Request DTO
 * 
 * This DTO validates and transfers data for updating a <%= camelCase %>.
 * All fields are optional since it's a partial update.
 */
export class Update<%= pascalCase %>RequestDto {
  @ApiProperty({
    description: 'The updated name of the <%= camelCase %>',
    example: 'Updated <%= pascalCase %> Name',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;
  
  @ApiProperty({
    description: 'The updated description of the <%= camelCase %>',
    example: 'This is an updated <%= camelCase %> description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  // Add additional properties with validation rules as needed
}
