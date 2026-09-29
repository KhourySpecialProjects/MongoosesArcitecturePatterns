import { CreateTaskDTO, Task, TaskWithAssignee } from "../entities/task.entity.js";
import { NotFoundError, ValidationError } from "../errors/domain-errors.js";
import { EventPublisherPort } from "../ports/driven/event-publisher.port.js";
import { TaskRepositoryPort } from "../ports/driven/task-repository.port.js";
import { UserRepositoryPort } from "../ports/driven/user-repository.port.js";
import { TaskUseCasePort } from "../ports/driving/task-use-case.port.js";

/**
 * Domain service implementing task management use cases.
 * Handles creating tasks, querying tasks with their assignees, and assigning tasks while publishing domain events.
 */
export class TaskService implements TaskUseCasePort {
  /**
   * Initializes a new instance of the TaskService with the required repository and messaging ports.
   *
   * @param taskRepository - Port used to manage task persistence.
   * @param userRepository - Port used to verify user existence for assignments.
   * @param eventPublisher - Port used to publish domain events when tasks are assigned.
   */
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  /**
   * Creates a new task in the system, validates the title and optional assignee, and publishes a {@link TaskAssignedEvent} if assigned.
   *
   * @param dto - Data transfer object containing the title, optional description, and optional assigneeId.
   * @returns A promise that resolves to the newly created task.
   * @throws {@link ValidationError} If title is missing or blank, or if the specified assigneeId does not exist.
   */
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    if (!dto.title || typeof dto.title !== "string" || !dto.title.trim()) {
      throw new ValidationError("title is required");
    }

    if (dto.assigneeId) {
      const user = await this.userRepository.findById(dto.assigneeId);
      if (!user) {
        throw new ValidationError("assigneeId does not exist");
      }
    }

    const task = await this.taskRepository.save({
      title: dto.title.trim(),
      description: dto.description ?? null,
      assigneeId: dto.assigneeId ?? null,
    });

    if (dto.assigneeId) {
      await this.eventPublisher.publish({
        eventType: "TaskAssigned",
        taskId: task.id,
        taskTitle: task.title,
        assigneeId: dto.assigneeId,
        occurredAt: new Date(),
      });
    }

    return task;
  }

  /**
   * Retrieves all tasks in the system with their associated assignees.
   *
   * @returns A promise that resolves to an array of tasks with assignee details.
   */
  async listTasks(): Promise<TaskWithAssignee[]> {
    return this.taskRepository.findAll();
  }

  /**
   * Retrieves a task by its unique identifier along with assignee details.
   *
   * @param id - The unique identifier of the task.
   * @returns A promise that resolves to the matching task with assignee, or null if not found or id is invalid.
   */
  async getTaskById(id: string): Promise<TaskWithAssignee | null> {
    if (!id || typeof id !== "string") {
      return null;
    }
    return this.taskRepository.findById(id);
  }

  /**
   * Assigns a task to a user, verifies that both task and user exist, updates the task, and publishes a {@link TaskAssignedEvent}.
   *
   * @param taskId - The unique identifier of the task to assign.
   * @param assigneeId - The unique identifier of the user to assign to the task.
   * @returns A promise that resolves to the updated task entity.
   * @throws {@link NotFoundError} If the task does not exist.
   * @throws {@link ValidationError} If assigneeId is missing/empty or the user does not exist.
   */
  async assignTask(taskId: string, assigneeId: string): Promise<Task> {
    if (!taskId || typeof taskId !== "string") {
      throw new NotFoundError("Task not found");
    }
    if (!assigneeId || typeof assigneeId !== "string" || !assigneeId.trim()) {
      throw new ValidationError("assigneeId is required");
    }

    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }

    const user = await this.userRepository.findById(assigneeId);
    if (!user) {
      throw new ValidationError("assigneeId does not exist");
    }

    const updatedTask = await this.taskRepository.updateAssignee(taskId, assigneeId);

    await this.eventPublisher.publish({
      eventType: "TaskAssigned",
      taskId: updatedTask.id,
      taskTitle: updatedTask.title,
      assigneeId,
      occurredAt: new Date(),
    });

    return updatedTask;
  }
}
