import type {FastifyInstance} from "fastify";
import {prisma} from "../db.js";

/**
 * Registers notification-related HTTP routes on the Fastify instance.
 *
 * @param app - The Fastify application instance to register routes on.
 * @returns A Promise that resolves when route registration is complete.
 */
export async function notificationRoutes(app: FastifyInstance) {
  app.get<{ Params: { userId: string } }>(
    "/notifications/:userId",
    async (request) => {
      return prisma.notification.findMany({
        where: { userId: request.params.userId },
        orderBy: { createdAt: "desc" },
      });
    }
  );

  app.patch<{ Params: { id: string } }>(
    "/notifications/:id/read",
    async (request, reply) => {
      try {
        return await prisma.notification.update({
          where: { id: request.params.id },
          data: { read: true },
        });
      } catch {
        return reply.code(404).send({ error: "notification not found" });
      }
    }
  );
}
