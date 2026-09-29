import { randomUUID } from "crypto";
import { CreateNotificationDTO, NotificationRepositoryPort } from "../src/core/ports/driven/notification-repository.port.js";
import { CreateTaskDTO, Task, TaskWithAssignee } from "../src/core/entities/task.entity.js";
import { TaskRepositoryPort } from "../src/core/ports/driven/task-repository.port.js";
import { CreateUserDTO, User } from "../src/core/entities/user.entity.js";
import { UserRepositoryPort } from "../src/core/ports/driven/user-repository.port.js";
import { Notification } from "../src/core/entities/notification.entity.js";

export class InMemoryUserRepository implements UserRepositoryPort {
  private users: User[] = [];

  async save(user: CreateUserDTO | User): Promise<User> {
    if ("id" in user && user.id) {
      const idx = this.users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        this.users[idx] = { ...this.users[idx], ...user };
        return this.users[idx];
      }
    }

    const newUser: User = {
      id: "id" in user && user.id ? user.id : randomUUID(),
      name: user.name,
      email: user.email,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return [...this.users].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  clear(): void {
    this.users = [];
  }
}

export class InMemoryTaskRepository implements TaskRepositoryPort {
  private tasks: Task[] = [];

  constructor(private readonly userRepo?: InMemoryUserRepository) {}

  async save(task: CreateTaskDTO | Task): Promise<Task> {
    if ("id" in task && task.id) {
      const idx = this.tasks.findIndex((t) => t.id === task.id);
      if (idx !== -1) {
        this.tasks[idx] = {
          ...this.tasks[idx],
          ...task,
          updatedAt: new Date(),
        };
        return this.tasks[idx];
      }
    }

    const newTask: Task = {
      id: "id" in task && task.id ? task.id : randomUUID(),
      title: task.title,
      description: task.description ?? null,
      status: "status" in task && task.status ? task.status : "todo",
      assigneeId: task.assigneeId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async findAll(): Promise<TaskWithAssignee[]> {
    const list: TaskWithAssignee[] = [];
    for (const task of [...this.tasks].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )) {
      const assignee =
        task.assigneeId && this.userRepo
          ? await this.userRepo.findById(task.assigneeId)
          : null;
      list.push({ ...task, assignee });
    }
    return list;
  }

  async findById(id: string): Promise<TaskWithAssignee | null> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    const assignee =
      task.assigneeId && this.userRepo
        ? await this.userRepo.findById(task.assigneeId)
        : null;
    return { ...task, assignee };
  }

  async updateAssignee(id: string, assigneeId: string): Promise<Task> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.assigneeId = assigneeId;
    task.updatedAt = new Date();
    return { ...task };
  }

  clear(): void {
    this.tasks = [];
  }
}

export class InMemoryNotificationRepository
  implements NotificationRepositoryPort
{
  private notifications: Notification[] = [];

  async save(
    notification: CreateNotificationDTO | Notification
  ): Promise<Notification> {
    if ("id" in notification && notification.id) {
      const idx = this.notifications.findIndex((n) => n.id === notification.id);
      if (idx !== -1) {
        this.notifications[idx] = {
          ...this.notifications[idx],
          ...notification,
        };
        return this.notifications[idx];
      }
    }

    const newNotif: Notification = {
      id:
        "id" in notification && notification.id
          ? notification.id
          : randomUUID(),
      userId: notification.userId,
      message: notification.message,
      read: "read" in notification ? notification.read : false,
      createdAt: new Date(),
    };
    this.notifications.push(newNotif);
    return newNotif;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notifications.find((n) => n.id === id) ?? null;
  }

  async update(notification: Notification): Promise<Notification> {
    const idx = this.notifications.findIndex((n) => n.id === notification.id);
    if (idx === -1) {
      throw new Error("Notification not found");
    }
    this.notifications[idx] = { ...notification };
    return { ...this.notifications[idx] };
  }

  clear(): void {
    this.notifications = [];
  }
}
