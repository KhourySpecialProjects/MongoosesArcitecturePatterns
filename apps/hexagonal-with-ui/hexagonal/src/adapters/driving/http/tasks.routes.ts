import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { NotFoundError, ValidationError } from "../../../core/errors/domain-errors.js";
import { TaskUseCasePort } from "../../../core/ports/driving/task-use-case.port.js";

/**
 * Request body schema for task creation endpoint.
 */
interface CreateTaskBody {
  /** The title of the task to create. */
  title?: string;
  /** An optional description of the task. */
  description?: string;
  /** An optional ID of the user to assign the task to. */
  assigneeId?: string;
}

/**
 * Request body schema for task assignment endpoint.
 */
interface AssignTaskBody {
  /** The ID of the user to assign the task to. */
  assigneeId?: string;
}

/**
 * Route parameters schema for requests operating on a single task by ID.
 */
interface TaskParams {
  /** The unique identifier of the task. */
  id: string;
}

/**
 * Registers HTTP routes for task management endpoints (`POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id/assign`).
 *
 * @param taskUseCase - Driving port implementation providing task operations.
 * @returns A Fastify plugin function that attaches task routes to the Fastify instance.
 */
export function registerTaskRoutes(taskUseCase: TaskUseCasePort): FastifyPluginAsync {
  return async function taskRoutes(fastify: FastifyInstance) {
    // POST /tasks
    fastify.post<{ Body: CreateTaskBody }>("/tasks", async (request, reply) => {
      const { title, description, assigneeId } = request.body || {};

      if (!title) {
        return reply.status(400).send({ error: "title is required" });
      }

      try {
        const task = await taskUseCase.createTask({
          title,
          description,
          assigneeId,
        });
        return reply.status(201).send(task);
      } catch (error) {
        if (error instanceof ValidationError) {
          return reply.status(400).send({ error: error.message });
        }
        throw error;
      }
    });

    // GET /tasks
    fastify.get("/tasks", async (_request, reply) => {
      const tasks = await taskUseCase.listTasks();
      return reply.send(tasks);
    });

    // GET /tasks/:id
    fastify.get<{ Params: TaskParams }>("/tasks/:id", async (request, reply) => {
      const { id } = request.params;
      const task = await taskUseCase.getTaskById(id);

      if (!task) {
        return reply.status(404).send({ error: "Task not found" });
      }

      return reply.send(task);
    });

    // PATCH /tasks/:id/assign
    fastify.patch<{ Params: TaskParams; Body: AssignTaskBody }>(
      "/tasks/:id/assign",
      async (request, reply) => {
        const { id } = request.params;
        const { assigneeId } = request.body || {};

        if (!assigneeId) {
          return reply.status(400).send({ error: "assigneeId is required" });
        }

        try {
          const task = await taskUseCase.assignTask(id, assigneeId);
          return reply.send(task);
        } catch (error) {
          if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
          }
          if (error instanceof ValidationError) {
            return reply.status(400).send({ error: error.message });
          }
          throw error;
        }
      }
    );
  };
}
