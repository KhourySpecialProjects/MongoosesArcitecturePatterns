import { PrismaClient } from "@prisma/client";
import { Notification } from "../../../core/entities/notification.entity.js";
import { CreateNotificationDTO, NotificationRepositoryPort } from "../../../core/ports/driven/notification-repository.port.js";

/**
 * Driven persistence adapter implementing {@link NotificationRepositoryPort} using Prisma ORM.
 * Manages database queries and mutations for notification records.
 */
export class PrismaNotificationRepository implements NotificationRepositoryPort {
  /**
   * Initializes a new instance of the PrismaNotificationRepository with the Prisma client.
   *
   * @param prisma - The PrismaClient instance used to interact with the database.
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Persists a notification to the database. Performs an upsert if an ID is present, or creates a new record.
   *
   * @param notification - The notification DTO or entity to persist.
   * @returns A promise that resolves to the saved notification entity.
   */
  async save(notification: CreateNotificationDTO | Notification): Promise<Notification> {
    if ("id" in notification && notification.id) {
      return this.prisma.notification.upsert({
        where: { id: notification.id },
        update: {
          message: notification.message,
          read: notification.read,
          userId: notification.userId,
        },
        create: {
          id: notification.id,
          message: notification.message,
          read: notification.read ?? false,
          userId: notification.userId,
        },
      });
    }

    return this.prisma.notification.create({
      data: {
        userId: notification.userId,
        message: notification.message,
      },
    });
  }

  /**
   * Retrieves all notifications for a specific user, ordered by creation date descending.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of matching notification entities.
   */
  async findByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a notification by its unique identifier.
   *
   * @param id - The unique identifier of the notification.
   * @returns A promise that resolves to the notification entity, or null if not found.
   */
  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing notification entity in the database.
   *
   * @param notification - The notification entity with updated values.
   * @returns A promise that resolves to the updated notification entity.
   */
  async update(notification: Notification): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        read: notification.read,
        message: notification.message,
      },
    });
  }
}
