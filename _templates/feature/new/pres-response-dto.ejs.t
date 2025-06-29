---
to: src/presentation/modules/<%= kebabCase %>/dtos/<%= kebabCase %>-response.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { <%= pascalCase %>Entity } from '../../../../domain/entities/<%= kebabCase %>.entity';

/**
 * <%= pascalCase %> Response DTO
 * 
 * This DTO formats entity data for response to the client.
 * It's part of the presentation layer and ensures consistent API responses.
 */
export class <%= pascalCase %>ResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the <%= camelCase %>',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;
  
  @ApiProperty({
    description: 'The name of the <%= camelCase %>',
    example: 'Sample <%= pascalCase %>'
  })
  name: string;
  
  @ApiProperty({
    description: 'The description of the <%= camelCase %>',
    example: 'This is a sample <%= camelCase %> description',
    required: false
  })
  description?: string;
  
  @ApiProperty({
    description: 'When the <%= camelCase %> was created',
    example: '2023-01-01T12:00:00Z'
  })
  createdAt: Date;
  
  @ApiProperty({
    description: 'When the <%= camelCase %> was last updated',
    example: '2023-01-01T12:00:00Z'
  })
  updatedAt: Date;
  
  // Add additional properties as needed

  constructor(entity: <%= pascalCase %>Entity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    // Map additional properties here
  }
}
