/**
 * Domain entity representing a user in the system.
 */
export interface User {
  /** The unique identifier of the user. */
  id: string;
  /** The full name of the user. */
  name: string;
  /** The email address of the user. */
  email: string;
  /** The creation timestamp formatted as ISO string or date representation. */
  createdAt: string;
}

/**
 * Payload required to register a new user.
 */
export interface CreateUserPayload {
  /** The full name of the new user. */
  name: string;
  /** The email address of the new user. */
  email: string;
}
