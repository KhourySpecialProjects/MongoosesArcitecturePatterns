import { PrismaClient } from "@prisma/client";
import { CreateTaskDTO, Task, TaskWithAssignee } from "../../../core/entities/task.entity.js";
import { TaskRepositoryPort } from "../../../core/ports/driven/task-repository.port.js";

/**
 * Driven persistence adapter implementing {@link TaskRepositoryPort} using Prisma ORM.
 * Manages database queries and mutations for tasks.
 */
export class PrismaTaskRepository implements TaskRepositoryPort {
  /**
   * Initializes a new instance of the PrismaTaskRepository with the Prisma client.
   *
   * @param prisma - The PrismaClient instance used to interact with the database.
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Persists a task to the database. Performs an upsert if an ID is provided, or creates a new task record.
   *
   * @param task - The task DTO or entity to persist.
   * @returns A promise that resolves to the saved task entity.
   */
  async save(task: CreateTaskDTO | Task): Promise<Task> {
    if ("id" in task && task.id) {
      return this.prisma.task.upsert({
        where: { id: task.id },
        update: {
          title: task.title,
          description: task.description,
          status: task.status,
          assigneeId: task.assigneeId,
        },
        create: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status ?? "todo",
          assigneeId: task.assigneeId,
        },
      });
    }

    return this.prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
      },
    });
  }

  /**
   * Retrieves all tasks along with their assignee details, ordered by creation date descending.
   *
   * @returns A promise that resolves to an array of tasks with assignee details.
   */
  async findAll(): Promise<TaskWithAssignee[]> {
    return this.prisma.task.findMany({
      include: {
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a task by its unique identifier along with its assigned user details.
   *
   * @param id - The unique identifier of the task.
   * @returns A promise that resolves to the task with assignee, or null if not found.
   */
  async findById(id: string): Promise<TaskWithAssignee | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
      },
    });
  }

  /**
   * Updates the assignee of a task in the database.
   *
   * @param id - The unique identifier of the task to update.
   * @param assigneeId - The unique identifier of the user to assign.
   * @returns A promise that resolves to the updated task entity.
   */
  async updateAssignee(id: string, assigneeId: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { assigneeId },
    });
  }
}
