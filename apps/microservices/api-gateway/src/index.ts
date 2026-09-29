import Fastify from "fastify";
import replyFrom from "@fastify/reply-from";

const app = Fastify({ logger: true });

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:3001";
const TASKS_SERVICE_URL = process.env.TASKS_SERVICE_URL || "http://localhost:3002";
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL || "http://localhost:3003";

app.register(replyFrom);

const makeUrl: (url: string) => string = (url) => url.replace(/^\/api/, "");

app.get("/", async () => {
  return { status: "ok", service: "api-gateway" };
});

app.get("/api/health", async () => {
  return { status: "ok", service: "api-gateway" };
});

// Proxy User routes
app.get("/api/users*", (request, reply) => {
  reply.from(`${USERS_SERVICE_URL}${makeUrl(request.url)}`);
});
app.post("/api/users*", (request, reply) => {
  reply.from(`${USERS_SERVICE_URL}${makeUrl(request.url)}`);
});

// Proxy Task routes
app.get("/api/tasks*", (request, reply) => {
  reply.from(`${TASKS_SERVICE_URL}${makeUrl(request.url)}`);
});
app.post("/api/tasks*", (request, reply) => {
  reply.from(`${TASKS_SERVICE_URL}${makeUrl(request.url)}`);
});
app.patch("/api/tasks*", (request, reply) => {
  reply.from(`${TASKS_SERVICE_URL}${makeUrl(request.url)}`);
});

// Proxy Notification routes
app.get("/api/notifications*", (request, reply) => {
  reply.from(`${NOTIFICATIONS_SERVICE_URL}${makeUrl(request.url)}`);
});
app.post("/api/notifications*", (request, reply) => {
  reply.from(`${NOTIFICATIONS_SERVICE_URL}${makeUrl(request.url)}`);
});
app.patch("/api/notifications*", (request, reply) => {
  reply.from(`${NOTIFICATIONS_SERVICE_URL}${makeUrl(request.url)}`);
});

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
