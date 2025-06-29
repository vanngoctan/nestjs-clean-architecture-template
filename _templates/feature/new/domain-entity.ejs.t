---
to: src/domain/entities/<%= kebabCase %>.entity.ts
---
/**
 * <%= pascalCase %> Entity
 * 
 * Represents the core <%= pascalCase %> domain entity with its properties and behaviors.
 * This is part of the domain layer and should not depend on external frameworks.
 */
export class <%= pascalCase %>Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Add your <%= pascalCase %> specific properties here
  // Example:
  // name: string;
  // description?: string;
  
  constructor(partial: Partial<<%= pascalCase %>Entity>) {
    Object.assign(this, partial);
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
  
  // Add domain methods here
  // These methods should enforce business rules and invariants
  
  /**
   * Updates the entity and sets the updatedAt timestamp
   */
  update(partial: Partial<Omit<<%= pascalCase %>Entity, 'id' | 'createdAt'>>) {
    Object.assign(this, partial);
    this.updatedAt = new Date();
  }
}
