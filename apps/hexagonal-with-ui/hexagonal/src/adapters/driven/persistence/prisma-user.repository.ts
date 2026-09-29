import { PrismaClient } from "@prisma/client";
import { CreateUserDTO, User } from "../../../core/entities/user.entity.js";
import { UserRepositoryPort } from "../../../core/ports/driven/user-repository.port.js";

/**
 * Driven persistence adapter implementing {@link UserRepositoryPort} using Prisma ORM.
 * Manages database queries and mutations for user records.
 */
export class PrismaUserRepository implements UserRepositoryPort {
  /**
   * Initializes a new instance of the PrismaUserRepository with the Prisma client.
   *
   * @param prisma - The PrismaClient instance used to interact with the database.
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Persists a user to the database. Performs an upsert if an ID is present, or creates a new user record.
   *
   * @param user - The user DTO or entity to persist.
   * @returns A promise that resolves to the saved user entity.
   */
  async save(user: CreateUserDTO | User): Promise<User> {
    if ("id" in user && user.id) {
      return this.prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }

  /**
   * Retrieves all users stored in the database, ordered by creation date descending.
   *
   * @returns A promise that resolves to an array of user entities.
   */
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the matching user entity, or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieves a user by their unique email address.
   *
   * @param email - The email address to look up.
   * @returns A promise that resolves to the matching user entity, or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
