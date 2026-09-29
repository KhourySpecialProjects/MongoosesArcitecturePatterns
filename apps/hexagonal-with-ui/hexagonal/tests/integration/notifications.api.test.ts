import { FastifyInstance } from "fastify";
import { InProcessEventBusAdapter } from "../../src/adapters/driven/messaging/in-process-event-bus.adapter.js";
import { buildApp } from "../../src/app.js";
import {
  InMemoryNotificationRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from "../helpers.js";

describe("Notifications API (Integration)", () => {
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

  describe("GET /notifications/:userId", () => {
    it("returns notifications for the given user", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      await notifRepo.save({
        userId: user.id,
        message: "First notification",
      });
      await notifRepo.save({
        userId: user.id,
        message: "Second notification",
      });

      const res = await app.inject({
        method: "GET",
        url: `/notifications/${user.id}`,
      });

      expect(res.statusCode).toBe(200);
      const notifications = res.json();
      expect(notifications.length).toBe(2);
    });

    it("returns 404 if user not found", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/notifications/non-existent-user-id",
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().error).toBe("User not found");
    });
  });

  describe("PATCH /notifications/:id/read", () => {
    it("marks notification as read", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      const notif = await notifRepo.save({
        userId: user.id,
        message: "Unread message",
      });

      const res = await app.inject({
        method: "PATCH",
        url: `/notifications/${notif.id}/read`,
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().read).toBe(true);
    });

    it("returns 404 if notification not found", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: "/notifications/non-existent-notif-id/read",
      });

      expect(res.statusCode).toBe(404);
      expect(res.json().error).toBe("Notification not found");
    });
  });
});
