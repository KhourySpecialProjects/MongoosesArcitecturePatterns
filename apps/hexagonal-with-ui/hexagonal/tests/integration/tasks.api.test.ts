import { FastifyInstance } from "fastify";
import { InProcessEventBusAdapter } from "../../src/adapters/driven/messaging/in-process-event-bus.adapter.js";
import { buildApp } from "../../src/app.js";
import {
  InMemoryNotificationRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from "../helpers.js";

describe("Tasks API (Integration)", () => {
  let app: FastifyInstance;
  let userRepo: InMemoryUserRepository;
  let taskRepo: InMemoryTaskRepository;
  let notifRepo: InMemoryNotificationRepository;
  let eventBus: InProcessEventBusAdapter;

  beforeEach(async () => {
    userRepo = new InMemoryUserRepository();
    taskRepo = new InMemoryTaskRepository(userRepo);
    notifRepo = new InMemoryNotificationRepository();
    eventBus = new InProcessEventBusAdapter();

    app = buildApp({
      userRepository: userRepo,
      taskRepository: taskRepo,
      notificationRepository: notifRepo,
      eventPublisher: eventBus,
    });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /tasks", () => {
    it("creates a task without assignee", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Refactor architecture" },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.title).toBe("Refactor architecture");
      expect(body.assigneeId).toBeNull();
      expect(body.status).toBe("todo");
    });

    it("creates a task with valid assignee and triggers notification via event bus", async () => {
      const user = await userRepo.save({
        name: "David",
        email: "david@example.com",
      });

      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: {
          title: "Write documentation",
          assigneeId: user.id,
        },
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.assigneeId).toBe(user.id);

      // Verify notification was created via event bus
      const notifications = await notifRepo.findByUserId(user.id);
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe(
        "You were assigned to task: Write documentation"
      );
    });

    it("returns 400 if title is missing", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: {},
      });

      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("title is required");
    });

    it("returns 400 if assigneeId does not exist", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: {
          title: "Invalid assignee task",
          assigneeId: "non-existent-user-id",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("assigneeId does not exist");
    });
  });

  describe("GET /tasks", () => {
    it("returns list of tasks with assignee details", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Task 1", assigneeId: user.id },
      });
      await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Task 2" },
      });

      const res = await app.inject({
        method: "GET",
        url: "/tasks",
      });

      expect(res.statusCode).toBe(200);
      const tasks = res.json();
      expect(tasks.length).toBe(2);
      const taskWithAssignee = tasks.find((t: any) => t.title === "Task 1");
      expect(taskWithAssignee.assignee.name).toBe("Alice");
    });
  });

  describe("GET /tasks/:id", () => {
    it("returns task by id", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Unique task" },
      });
      const taskId = createRes.json().id;

      const res = await app.inject({
        method: "GET",
        url: `/tasks/${taskId}`,
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().title).toBe("Unique task");
    });

    it("returns 404 when task not found", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/tasks/non-existent-task-id",
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().error).toBe("Task not found");
    });
  });

  describe("PATCH /tasks/:id/assign", () => {
    it("assigns task to a user and generates notification", async () => {
      const user = await userRepo.save({
        name: "Eve",
        email: "eve@example.com",
      });

      const createRes = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Unassigned task" },
      });
      const taskId = createRes.json().id;

      const assignRes = await app.inject({
        method: "PATCH",
        url: `/tasks/${taskId}/assign`,
        payload: { assigneeId: user.id },
      });

      expect(assignRes.statusCode).toBe(200);
      expect(assignRes.json().assigneeId).toBe(user.id);

      const notifs = await notifRepo.findByUserId(user.id);
      expect(notifs.length).toBe(1);
      expect(notifs[0].message).toBe("You were assigned to task: Unassigned task");
    });

    it("returns 400 when assigneeId is missing in body", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Unassigned task" },
      });
      const taskId = createRes.json().id;

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${taskId}/assign`,
        payload: {},
      });

      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("assigneeId is required");
    });

    it("returns 404 when task does not exist", async () => {
      const user = await userRepo.save({
        name: "User",
        email: "user@example.com",
      });

      const res = await app.inject({
        method: "PATCH",
        url: "/tasks/non-existent-task-id/assign",
        payload: { assigneeId: user.id },
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().error).toBe("Task not found");
    });

    it("returns 400 when assignee does not exist", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { title: "Unassigned task" },
      });
      const taskId = createRes.json().id;

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${taskId}/assign`,
        payload: { assigneeId: "non-existent-user-id" },
      });

      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("assigneeId does not exist");
    });
  });
});
