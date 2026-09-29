import { CreateUserDTO, User } from "../../entities/user.entity.js";

/**
 * Driven port interface defining persistence operations for user accounts.
 */
export interface UserRepositoryPort {
  /**
   * Persists a new user or updates an existing user in the data store.
   *
   * @param user - The user DTO to create or the user entity to save.
   * @returns A promise that resolves to the saved user entity.
   */
  save(user: CreateUserDTO | User): Promise<User>;

  /**
   * Retrieves all users stored in the system, ordered by creation date descending.
   *
   * @returns A promise that resolves to an array of user entities.
   */
  findAll(): Promise<User[]>;

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the matching user entity, or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Retrieves a user by their email address.
   *
   * @param email - The email address to search for.
   * @returns A promise that resolves to the matching user entity, or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;
}
