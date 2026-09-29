/**
 * Represents a user account entity in the system.
 */
export interface User {
  /** The unique identifier of the user. */
  id: string;
  /** The full name of the user. */
  name: string;
  /** The unique email address of the user. */
  email: string;
  /** The timestamp when the user was created. */
  createdAt: Date;
}

/**
 * Data transfer object containing the required properties to create a new user.
 */
export interface CreateUserDTO {
  /** The full name of the user. */
  name: string;
  /** The unique email address of the user. */
  email: string;
}
