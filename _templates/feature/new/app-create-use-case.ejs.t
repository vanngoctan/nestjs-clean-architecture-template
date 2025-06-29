---
to: src/application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= pascalCase %>Entity } from '../../../domain/entities/<%= kebabCase %>.entity';
import { <%= pascalCase %>Repository } from '../../../domain/repositories/<%= kebabCase %>.repository';

/**
 * DTO for creating a <%= camelCase %>
 */
export class Create<%= pascalCase %>Dto {
  // Define the properties required to create a <%= camelCase %>
  // Example:
  // name: string;
  // description?: string;
}

/**
 * CreateUser Use Case
 * 
 * Application service that orchestrates the creation of a <%= camelCase %>.
 * This is part of the application layer and implements business logic.
 */
@Injectable()
export class Create<%= pascalCase %>UseCase {
  constructor(private readonly <%= camelCase %>Repository: <%= pascalCase %>Repository) {}
  
  /**
   * Executes the use case to create a new <%= camelCase %>
   */
  async execute(dto: Create<%= pascalCase %>Dto): Promise<<%= pascalCase %>Entity> {
    // Create a new entity from the DTO
    const <%= camelCase %> = new <%= pascalCase %>Entity({
      ...dto,
      // Set any default values or handle any business logic
    });
    
    // Persist the entity using the repository
    return this.<%= camelCase %>Repository.create(<%= camelCase %>);
  }
}
