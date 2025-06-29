---
to: src/domain/exceptions/<%= kebabCase %>-not-found.exception.ts
---
/**
 * <%= pascalCase %>NotFoundException
 * 
 * Domain exception thrown when a requested <%= camelCase %> cannot be found.
 * This is part of the domain layer and represents a business rule violation.
 */
export class <%= pascalCase %>NotFoundException extends Error {
  constructor(id: string) {
    super(`<%= pascalCase %> with ID '${id}' was not found`);
    this.name = '<%= pascalCase %>NotFoundException';
  }
}
