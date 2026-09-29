import { CreateUserDTO, User } from "../entities/user.entity.js";
import { ConflictError, ValidationError } from "../errors/domain-errors.js";
import { UserRepositoryPort } from "../ports/driven/user-repository.port.js";
import { UserUseCasePort } from "../ports/driving/user-use-case.port.js";

/**
 * Domain service implementing user management use cases.
 * Handles user account creation, retrieval of all users, and finding users by ID.
 */
export class UserService implements UserUseCasePort {
  /**
   * Initializes a new instance of the UserService with the required user repository port.
   *
   * @param userRepository - Port used to manage user entity persistence.
   */
  constructor(private readonly userRepository: UserRepositoryPort) {}

  /**
   * Creates a new user account after validating input presence and verifying email uniqueness.
   *
   * @param dto - Data transfer object containing the user's name and email.
   * @returns A promise that resolves to the newly created user entity.
   * @throws {@link ValidationError} If name or email is missing or blank.
   * @throws {@link ConflictError} If the email address is already registered.
   */
  async createUser(dto: CreateUserDTO): Promise<User> {
    if (!dto.name || typeof dto.name !== "string" || !dto.name.trim()) {
      throw new ValidationError("name is required");
    }
    if (!dto.email || typeof dto.email !== "string" || !dto.email.trim()) {
      throw new ValidationError("email is required");
    }

    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError("email already in use");
    }

    return this.userRepository.save({
      name: dto.name.trim(),
      email: dto.email.trim(),
    });
  }

  /**
   * Retrieves all users currently registered in the system.
   *
   * @returns A promise that resolves to an array of all user entities.
   */
  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A promise that resolves to the user entity, or null if not found or id is invalid.
   */
  async getUserById(id: string): Promise<User | null> {
    if (!id || typeof id !== "string") {
      return null;
    }
    return this.userRepository.findById(id);
  }
}
