import { CreateTaskDTO, Task, TaskWithAssignee } from "../../entities/task.entity.js";

/**
 * Driven port interface defining persistence operations for tasks.
 */
export interface TaskRepositoryPort {
  /**
   * Persists a new task or updates an existing one in the data store.
   *
   * @param task - The task DTO to create or the task entity to save.
   * @returns A promise that resolves to the saved task entity.
   */
  save(task: CreateTaskDTO | Task): Promise<Task>;

  /**
   * Retrieves all tasks from the data store, including their assigned user details.
   *
   * @returns A promise that resolves to an array of tasks with assignee details.
   */
  findAll(): Promise<TaskWithAssignee[]>;

  /**
   * Retrieves a task by its unique identifier, including its assigned user details.
   *
   * @param id - The unique identifier of the task.
   * @returns A promise that resolves to the matching task with assignee details, or null if not found.
   */
  findById(id: string): Promise<TaskWithAssignee | null>;

  /**
   * Updates the assignee of an existing task in the data store.
   *
   * @param id - The unique identifier of the task to update.
   * @param assigneeId - The unique identifier of the user to assign to the task.
   * @returns A promise that resolves to the updated task entity.
   */
  updateAssignee(id: string, assigneeId: string): Promise<Task>;
}
