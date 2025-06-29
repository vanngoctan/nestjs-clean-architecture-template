/**
 * Base exception class for domain-specific errors.
 * All domain exceptions should extend this class.
 */
export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
