import { CreateTaskDTO, Task, TaskWithAssignee } from "../../entities/task.entity.js";

/**
 * Driving (primary) port interface exposing use cases related to task management.
 */
export interface TaskUseCasePort {
  /**
   * Creates a new task and optionally assigns it to a user, publishing a domain event if assigned.
   *
   * @param dto - The task creation details including title, description, and optional assigneeId.
   * @returns A promise that resolves to the newly created task entity.
   * @throws {@link ValidationError} If the task title is missing/empty or if assigneeId does not correspond to an existing user.
   */
  createTask(dto: CreateTaskDTO): Promise<Task>;

  /**
   * Lists all tasks in the system with their associated assignees.
   *
   * @returns A promise that resolves to an array of tasks with assignee details.
   */
  listTasks(): Promise<TaskWithAssignee[]>;

  /**
   * Retrieves a task by its unique identifier along with assignee details.
   *
   * @param id - The unique identifier of the task.
   * @returns A promise that resolves to the task with assignee details, or null if not found.
   */
  getTaskById(id: string): Promise<TaskWithAssignee | null>;

  /**
   * Assigns an existing task to a user and publishes a TaskAssigned domain event.
   *
   * @param taskId - The unique identifier of the task to assign.
   * @param assigneeId - The unique identifier of the user to assign the task to.
   * @returns A promise that resolves to the updated task entity.
   * @throws {@link NotFoundError} If the task with the given ID does not exist.
   * @throws {@link ValidationError} If the assigneeId is missing/empty or does not correspond to an existing user.
   */
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
}
