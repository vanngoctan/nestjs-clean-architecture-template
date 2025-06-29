import { DomainException } from './domain.exception';

/**
 * Exception thrown when attempting to create a user with an email that already exists.
 */
export class UserAlreadyExistsException extends DomainException {
  constructor(email?: string) {
    super(
      email
        ? `User with email '${email}' already exists`
        : 'User with the provided email already exists'
    );
  }
}
