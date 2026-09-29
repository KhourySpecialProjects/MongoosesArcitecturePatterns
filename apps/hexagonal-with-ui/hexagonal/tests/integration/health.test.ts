import { FastifyInstance } from "fastify";
import { buildApp } from "../../src/app.js";
import {
  InMemoryNotificationRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from "../helpers.js";

describe("Health & Root API (Integration)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const userRepo = new InMemoryUserRepository();
    const taskRepo = new InMemoryTaskRepository(userRepo);
    const notifRepo = new InMemoryNotificationRepository();

    app = buildApp({
      userRepository: userRepo,
      taskRepository: taskRepo,
      notificationRepository: notifRepo,
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET / returns ok", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: "ok",
      message: "taskflow hexagonal monolith",
    });
  });

  it("GET /health returns ok", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: "ok",
    });
  });
});
