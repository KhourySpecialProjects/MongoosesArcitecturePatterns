/**
 * Represents a base domain error thrown when a business or domain rule is violated.
 */
export class DomainError extends Error {
  /**
   * Initializes a new instance of the DomainError class with the specified error message and sets the error name.
   *
   * @param message - The descriptive error message explaining the domain failure.
   */
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Represents a validation error thrown when input parameters or domain constraints fail validation.
 */
export class ValidationError extends DomainError {
  /**
   * Initializes a new instance of the ValidationError class with the specified error message and sets the error name.
   *
   * @param message - The descriptive error message detailing the validation failure.
   */
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Represents an error thrown when a requested domain entity or resource cannot be found.
 */
export class NotFoundError extends DomainError {
  /**
   * Initializes a new instance of the NotFoundError class with the specified error message and sets the error name.
   *
   * @param message - The descriptive error message specifying which resource was not found.
   */
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Represents a conflict error thrown when an operation violates a uniqueness constraint or domain conflict.
 */
export class ConflictError extends DomainError {
  /**
   * Initializes a new instance of the ConflictError class with the specified error message and sets the error name.
   *
   * @param message - The descriptive error message explaining the conflict.
   */
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
