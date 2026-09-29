import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

interface CreateTaskBody {
  title: string;
  description?: string;
  assigneeId?: string;
}

interface AssignTaskBody {
  assigneeId: string;
}

/**
 * Registers task-related HTTP routes on the Fastify instance.
 *
 * @param app - The Fastify application instance to register routes on.
 * @returns A Promise that resolves when route registration is complete.
 */
export async function taskRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateTaskBody }>("/tasks", async (request, reply) => {
    const { title, description, assigneeId } = request.body;

    if (!title) {
      return reply.code(400).send({ error: "title is required" });
    }

    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      if (!assignee) {
        return reply.code(400).send({ error: "assigneeId does not exist" });
      }
    }

    const task = await prisma.task.create({
      data: { title, description, assigneeId },
    });

    if (assigneeId) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          message: `Task "${title}" was assigned to you`,
        },
      });
    }

    return reply.code(201).send(task);
  });

  app.get("/tasks", async () => {
    return prisma.task.findMany({
      include: { assignee: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  });

  app.get<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
    const task = await prisma.task.findUnique({
      where: { id: request.params.id },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });
    if (!task) {
      return reply.code(404).send({ error: "task not found" });
    }
    return task;
  });

  app.patch<{ Params: { id: string }; Body: AssignTaskBody }>(
    "/tasks/:id/assign",
    async (request, reply) => {
      const { id } = request.params;
      const { assigneeId } = request.body;

      const [task, assignee] = await Promise.all([
        prisma.task.findUnique({ where: { id } }),
        prisma.user.findUnique({ where: { id: assigneeId } }),
      ]);

      if (!task) {
        return reply.code(404).send({ error: "task not found" });
      }
      if (!assignee) {
        return reply.code(400).send({ error: "assigneeId does not exist" });
      }

      const updated = await prisma.task.update({
        where: { id },
        data: { assigneeId },
      });

      await prisma.notification.create({
        data: {
          userId: assigneeId,
          message: `Task "${task.title}" was assigned to you`,
        },
      });

      return updated;
    }
  );
}
