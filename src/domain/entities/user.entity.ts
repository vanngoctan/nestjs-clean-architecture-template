/**
 * User entity representing a user in the domain.
 * This is a pure TypeScript class with no framework dependencies.
 */
export class User {
  id: string | number;
  email: string;
  name: string;
  passwordHash: string;

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
