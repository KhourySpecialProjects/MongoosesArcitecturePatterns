import { AssignTaskPayload, CreateTaskPayload, TaskWithAssignee } from "../types/task.types";
import { request } from "./api-client";

/**
 * Creates a new task in the hexagonal system.
 *
 * @param payload - Task creation fields including title, optional description, and optional assigneeId.
 * @returns A promise resolving to the created task entity with populated assignee data.
 */
export async function createTask(payload: CreateTaskPayload): Promise<TaskWithAssignee> {
  return request<TaskWithAssignee>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches all tasks including their assignee information.
 *
 * @returns A promise resolving to an array of TaskWithAssignee entities.
 */
export async function fetchTasks(): Promise<TaskWithAssignee[]> {
  return request<TaskWithAssignee[]>("/tasks", {
    method: "GET",
  });
}

/**
 * Fetches a single task by its unique identifier along with assignee details.
 *
 * @param id - The UUID of the task.
 * @returns A promise resolving to the TaskWithAssignee entity.
 */
export async function fetchTaskById(id: string): Promise<TaskWithAssignee> {
  return request<TaskWithAssignee>(`/tasks/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

/**
 * Assigns an existing task to a specific user.
 *
 * @param taskId - The UUID of the task to assign.
 * @param payload - The payload containing the assignee user ID.
 * @returns A promise resolving to the updated TaskWithAssignee entity.
 */
export async function assignTask(taskId: string, payload: AssignTaskPayload): Promise<TaskWithAssignee> {
  return request<TaskWithAssignee>(`/tasks/${encodeURIComponent(taskId)}/assign`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
