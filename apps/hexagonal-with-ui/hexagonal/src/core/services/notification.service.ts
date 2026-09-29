import { TaskAssignedEvent } from "../entities/events.js";
import { Notification } from "../entities/notification.entity.js";
import { NotFoundError } from "../errors/domain-errors.js";
import { NotificationRepositoryPort } from "../ports/driven/notification-repository.port.js";
import { UserRepositoryPort } from "../ports/driven/user-repository.port.js";
import { NotificationUseCasePort } from "../ports/driving/notification-use-case.port.js";

/**
 * Domain service implementing the notification use cases.
 * Handles listing user notifications, marking notifications as read, and generating notifications for domain events.
 */
export class NotificationService implements NotificationUseCasePort {
  /**
   * Initializes a new instance of the NotificationService with the required repository ports.
   *
   * @param notificationRepository - Port used to manage notification persistence.
   * @param userRepository - Port used to verify user existence.
   */
  constructor(
    private readonly notificationRepository: NotificationRepositoryPort,
    private readonly userRepository: UserRepositoryPort
  ) {}

  /**
   * Retrieves all notifications for a given user after verifying that the user exists.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of notifications for the user.
   * @throws {@link NotFoundError} If userId is invalid or the user does not exist in the repository.
   */
  async listUserNotifications(userId: string): Promise<Notification[]> {
    if (!userId || typeof userId !== "string") {
      throw new NotFoundError("User not found");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.notificationRepository.findByUserId(userId);
  }

  /**
   * Marks a notification as read after validating its existence.
   *
   * @param notificationId - The unique identifier of the notification to mark as read.
   * @returns A promise that resolves to the updated notification.
   * @throws {@link NotFoundError} If notificationId is invalid or the notification is not found.
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    if (!notificationId || typeof notificationId !== "string") {
      throw new NotFoundError("Notification not found");
    }

    const existing = await this.notificationRepository.findById(notificationId);
    if (!existing) {
      throw new NotFoundError("Notification not found");
    }

    return this.notificationRepository.update({
      ...existing,
      read: true,
    });
  }

  /**
   * Handles a task assigned domain event by persisting a notification for the newly assigned user.
   *
   * @param event - The task assignment event containing assignee ID and task title.
   * @returns A promise that resolves once the notification is created.
   */
  async handleTaskAssigned(event: TaskAssignedEvent): Promise<void> {
    await this.notificationRepository.save({
      userId: event.assigneeId,
      message: `You were assigned to task: ${event.taskTitle}`,
    });
  }
}
