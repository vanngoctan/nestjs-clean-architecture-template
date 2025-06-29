---
to: src/domain/repositories/<%= kebabCase %>.repository.ts
---
import { <%= pascalCase %>Entity } from '../entities/<%= kebabCase %>.entity';

/**
 * <%= pascalCase %> Repository Interface
 * 
 * Defines the contract for <%= pascalCase %> data access operations.
 * This is part of the domain layer and provides persistence abstractions.
 */
export interface <%= pascalCase %>Repository {
  /**
   * Creates a new <%= camelCase %> record
   */
  create(<%= camelCase %>: <%= pascalCase %>Entity): Promise<<%= pascalCase %>Entity>;
  
  /**
   * Finds a <%= camelCase %> by its ID
   */
  findById(id: string): Promise<<%= pascalCase %>Entity | null>;
  
  /**
   * Finds all <%= camelCasePlural %>
   */
  findAll(): Promise<<%= pascalCase %>Entity[]>;
  
  /**
   * Updates an existing <%= camelCase %>
   */
  update(id: string, <%= camelCase %>: Partial<Omit<<%= pascalCase %>Entity, 'id'>>): Promise<<%= pascalCase %>Entity | null>;
  
  /**
   * Deletes a <%= camelCase %> by its ID
   */
  delete(id: string): Promise<boolean>;
  
  // Add additional repository methods as needed for your domain
}
