import { FastifyInstance } from "fastify";
import { buildApp } from "../../src/app.js";
import {
  InMemoryNotificationRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from "../helpers.js";

describe("Users API (Integration)", () => {
  let app: FastifyInstance;
  let userRepo: InMemoryUserRepository;

  beforeEach(async () => {
    userRepo = new InMemoryUserRepository();
    const taskRepo = new InMemoryTaskRepository(userRepo);
    const notifRepo = new InMemoryNotificationRepository();

    app = buildApp({
      userRepository: userRepo,
      taskRepository: taskRepo,
      notificationRepository: notifRepo,
    });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /users", () => {
    it("creates a user and returns 201", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice", email: "alice@example.com" },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.name).toBe("Alice");
      expect(body.email).toBe("alice@example.com");
      expect(body).toHaveProperty("id");
    });

    it("returns 400 if name is missing", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { email: "alice@example.com" },
      });

      expect(res.statusCode).toBe(400);
      expect(res.json()).toHaveProperty("error");
    });

    it("returns 400 if email is missing", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice" },
      });

      expect(res.statusCode).toBe(400);
      expect(res.json()).toHaveProperty("error");
    });

    it("returns 409 if email is already in use", async () => {
      await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice", email: "alice@example.com" },
      });

      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice 2", email: "alice@example.com" },
      });

      expect(res.statusCode).toBe(409);
      expect(res.json().error).toBe("email already in use");
    });
  });

  describe("GET /users", () => {
    it("returns an empty array when no users exist", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/users",
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });

    it("returns list of users", async () => {
      await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice", email: "alice@example.com" },
      });
      await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Bob", email: "bob@example.com" },
      });

      const res = await app.inject({
        method: "GET",
        url: "/users",
      });

      expect(res.statusCode).toBe(200);
      const list = res.json();
      expect(list.length).toBe(2);
    });
  });

  describe("GET /users/:id", () => {
    it("returns the user if found", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Alice", email: "alice@example.com" },
      });
      const userId = createRes.json().id;

      const res = await app.inject({
        method: "GET",
        url: `/users/${userId}`,
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().email).toBe("alice@example.com");
    });

    it("returns 404 if user not found", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/users/non-existent-id",
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().error).toBe("User not found");
    });
  });
});
