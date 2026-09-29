import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { NotFoundError } from "../../../core/errors/domain-errors.js";
import { NotificationUseCasePort } from "../../../core/ports/driving/notification-use-case.port.js";

/**
 * Route parameter interface for requests targeting a single notification by ID.
 */
interface NotificationParams {
  /** The unique identifier of the notification. */
  id: string;
}

/**
 * Route parameter interface for requests querying notifications for a user by user ID.
 */
interface UserNotificationParams {
  /** The unique identifier of the user. */
  userId: string;
}

/**
 * Registers HTTP routes for notification management endpoints (`GET /notifications/:userId`, `PATCH /notifications/:id/read`).
 *
 * @param notificationUseCase - Driving port implementation providing notification operations.
 * @returns A Fastify plugin function that attaches notification routes to the Fastify instance.
 */
export function registerNotificationRoutes(
  notificationUseCase: NotificationUseCasePort
): FastifyPluginAsync {
  return async function notificationRoutes(fastify: FastifyInstance) {
    // GET /notifications/:userId
    fastify.get<{ Params: UserNotificationParams }>(
      "/notifications/:userId",
      async (request, reply) => {
        const { userId } = request.params;

        try {
          const notifications = await notificationUseCase.listUserNotifications(userId);
          return reply.send(notifications);
        } catch (error) {
          if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
          }
          throw error;
        }
      }
    );

    // PATCH /notifications/:id/read
    fastify.patch<{ Params: NotificationParams }>(
      "/notifications/:id/read",
      async (request, reply) => {
        const { id } = request.params;

        try {
          const notification = await notificationUseCase.markAsRead(id);
          return reply.send(notification);
        } catch (error) {
          if (error instanceof NotFoundError) {
            return reply.status(404).send({ error: error.message });
          }
          throw error;
        }
      }
    );
  };
}
