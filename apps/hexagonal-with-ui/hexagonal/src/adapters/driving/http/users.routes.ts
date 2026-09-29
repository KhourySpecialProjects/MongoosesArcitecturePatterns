import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ConflictError, ValidationError } from "../../../core/errors/domain-errors.js";
import { UserUseCasePort } from "../../../core/ports/driving/user-use-case.port.js";

/**
 * Request body schema for user registration endpoint.
 */
interface CreateUserBody {
  /** The full name of the user. */
  name?: string;
  /** The email address of the user. */
  email?: string;
}

/**
 * Route parameters schema for requests targeting a user by ID.
 */
interface UserParams {
  /** The unique identifier of the user. */
  id: string;
}

/**
 * Registers HTTP routes for user management endpoints (`POST /users`, `GET /users`, `GET /users/:id`).
 *
 * @param userUseCase - Driving port implementation providing user account operations.
 * @returns A Fastify plugin function that attaches user routes to the Fastify instance.
 */
export function registerUserRoutes(userUseCase: UserUseCasePort): FastifyPluginAsync {
  return async function userRoutes(fastify: FastifyInstance) {
    // POST /users
    fastify.post<{ Body: CreateUserBody }>("/users", async (request, reply) => {
      const { name, email } = request.body || {};

      if (!name || !email) {
        return reply.status(400).send({ error: "name and email are required" });
      }

      try {
        const user = await userUseCase.createUser({ name, email });
        return reply.status(201).send(user);
      } catch (error) {
        if (error instanceof ConflictError) {
          return reply.status(409).send({ error: error.message });
        }
        if (error instanceof ValidationError) {
          return reply.status(400).send({ error: error.message });
        }
        throw error;
      }
    });

    // GET /users
    fastify.get("/users", async (_request, reply) => {
      const users = await userUseCase.listUsers();
      return reply.send(users);
    });

    // GET /users/:id
    fastify.get<{ Params: UserParams }>("/users/:id", async (request, reply) => {
      const { id } = request.params;
      const user = await userUseCase.getUserById(id);

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      return reply.send(user);
    });
  };
}
