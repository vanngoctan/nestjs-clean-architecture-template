---
to: src/application/use-cases/<%= kebabCase %>/get-<%= kebabCase %>-by-id.use-case.ts
---
import { Injectable } from '@nestjs/common';
import { <%= pascalCase %>Entity } from '../../../domain/entities/<%= kebabCase %>.entity';
import { <%= pascalCase %>Repository } from '../../../domain/repositories/<%= kebabCase %>.repository';
import { <%= pascalCase %>NotFoundException } from '../../../domain/exceptions/<%= kebabCase %>-not-found.exception';

/**
 * Get<%= pascalCase %>ById Use Case
 * 
 * Application service that retrieves a <%= camelCase %> by its ID.
 * This is part of the application layer and implements business logic.
 */
@Injectable()
export class Get<%= pascalCase %>ByIdUseCase {
  constructor(private readonly <%= camelCase %>Repository: <%= pascalCase %>Repository) {}
  
  /**
   * Executes the use case to get a <%= camelCase %> by its ID
   * @throws <%= pascalCase %>NotFoundException if the <%= camelCase %> is not found
   */
  async execute(id: string): Promise<<%= pascalCase %>Entity> {
    const <%= camelCase %> = await this.<%= camelCase %>Repository.findById(id);
    
    if (!<%= camelCase %>) {
      throw new <%= pascalCase %>NotFoundException(id);
    }
    
    return <%= camelCase %>;
  }
}
