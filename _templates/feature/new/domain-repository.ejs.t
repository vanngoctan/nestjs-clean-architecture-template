---
to: src/domain/repositories/<%= kebabCase %>.repository.ts
---
import { <%= pascalCase %>Entity } from '../entities/<%= kebabCase %>.entity';

/**
 * <%= pascalCase %> Repository Abstract Class
 * 
 * Defines the contract for <%= pascalCase %> data access operations.
 * This is part of the domain layer and provides persistence abstractions.
 */
export abstract class <%= pascalCase %>Repository {
  /**
   * Creates a new <%= camelCase %> record
   */
  abstract create(<%= camelCase %>: <%= pascalCase %>Entity): Promise<<%= pascalCase %>Entity>;
  
  /**
   * Finds <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  abstract findById(id: string): Promise<<%= pascalCase %>Entity | null>;
  
  /**
   * Finds all <%= camelCasePlural %>
   */
  abstract findAll(): Promise<<%= pascalCase %>Entity[]>;
  
  /**
   * Updates an existing <%= camelCase %>
   */
  abstract update(id: string, <%= camelCase %>: Partial<Omit<<%= pascalCase %>Entity, 'id'>>): Promise<<%= pascalCase %>Entity | null>;
  
  /**
   * Deletes <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  abstract delete(id: string): Promise<boolean>;
  
  // Add additional repository methods as needed for your domain
}
