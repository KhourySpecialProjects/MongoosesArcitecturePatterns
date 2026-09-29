import { CreateUserDTO, User } from "../../entities/user.entity.js";

/**
 * Driving (primary) port interface exposing use cases related to user account management.
 */
export interface UserUseCasePort {
  /**
   * Creates a new user account with the specified name and email.
   *
   * @param dto - The user details including name and email.
   * @returns A promise that resolves to the created user entity.
   * @throws {@link ValidationError} If name or email is missing or blank.
   * @throws {@link ConflictError} If the email is already in use by another user.
   */
  createUser(dto: CreateUserDTO): Promise<User>;

  /**
   * Retrieves all users currently registered in the system.
   *
   * @returns A promise that resolves to an array of user entities.
   */
  listUsers(): Promise<User[]>;

  /**
   * Retrieves a single user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user entity, or null if not found.
   */
  getUserById(id: string): Promise<User | null>;
}
