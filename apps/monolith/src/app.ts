import Fastify from "fastify";
import { userRoutes } from "./routes/users.js";
import { taskRoutes } from "./routes/tasks.js";
import { notificationRoutes } from "./routes/notifications.js";

/**
 * Builds and configures the Fastify application instance.
 *
 * Registers routes for users, tasks, and notifications, and defines a root health endpoint.
 *
 * @returns The configured Fastify application instance.
 */
export function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/", async () => {
    return { status: "ok", message: "taskflow monolith" };
  });

  app.register(userRoutes);
  app.register(taskRoutes);
  app.register(notificationRoutes);

  return app;
}
