import { NotFoundError } from "../../src/core/errors/domain-errors.js";
import { NotificationService } from "../../src/core/services/notification.service.js";
import { InMemoryNotificationRepository, InMemoryUserRepository } from "../helpers.js";

describe("NotificationService (Unit)", () => {
  let userRepo: InMemoryUserRepository;
  let notifRepo: InMemoryNotificationRepository;
  let notificationService: NotificationService;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    notifRepo = new InMemoryNotificationRepository();
    notificationService = new NotificationService(notifRepo, userRepo);
  });

  describe("listUserNotifications", () => {
    it("returns all notifications for a given user", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      await notifRepo.save({
        userId: user.id,
        message: "Notif 1",
      });
      await notifRepo.save({
        userId: user.id,
        message: "Notif 2",
      });

      const list = await notificationService.listUserNotifications(user.id);
      expect(list.length).toBe(2);
      expect(list[0].userId).toBe(user.id);
    });

    it("throws NotFoundError when user does not exist", async () => {
      await expect(
        notificationService.listUserNotifications("non-existent-user-id")
      ).rejects.toThrow(NotFoundError);

      await expect(
        notificationService.listUserNotifications("non-existent-user-id")
      ).rejects.toThrow("User not found");
    });
  });

  describe("markAsRead", () => {
    it("marks an existing notification as read", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      const notif = await notifRepo.save({
        userId: user.id,
        message: "Unread message",
      });
      expect(notif.read).toBe(false);

      const updated = await notificationService.markAsRead(notif.id);
      expect(updated.read).toBe(true);

      const fetched = await notifRepo.findById(notif.id);
      expect(fetched?.read).toBe(true);
    });

    it("throws NotFoundError when notification does not exist", async () => {
      await expect(
        notificationService.markAsRead("non-existent-notif-id")
      ).rejects.toThrow(NotFoundError);

      await expect(
        notificationService.markAsRead("non-existent-notif-id")
      ).rejects.toThrow("Notification not found");
    });
  });

  describe("handleTaskAssigned", () => {
    it("creates a notification when handling a TaskAssignedEvent", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      await notificationService.handleTaskAssigned({
        eventType: "TaskAssigned",
        taskId: "task-123",
        taskTitle: "Fix Hexagonal Design",
        assigneeId: user.id,
        occurredAt: new Date(),
      });

      const list = await notifRepo.findByUserId(user.id);
      expect(list.length).toBe(1);
      expect(list[0].message).toBe("You were assigned to task: Fix Hexagonal Design");
      expect(list[0].read).toBe(false);
    });
  });
});
