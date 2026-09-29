import { User } from "./user.entity.js";

/**
 * Represents a task entity within the system.
 */
export interface Task {
  /** The unique identifier of the task. */
  id: string;
  /** The title or brief summary of the task. */
  title: string;
  /** An optional detailed description of the task. */
  description: string | null;
  /** The current status of the task (e.g., "todo", "in_progress", "done"). */
  status: string; // "todo" | "in_progress" | "done"
  /** The identifier of the assigned user, or null if unassigned. */
  assigneeId: string | null;
  /** The timestamp when the task was created. */
  createdAt: Date;
  /** The timestamp when the task was last updated. */
  updatedAt: Date;
}

/**
 * Represents a task entity populated with its associated assignee details.
 */
export interface TaskWithAssignee extends Task {
  /** The user assigned to the task, or null if unassigned. */
  assignee: User | null;
}

/**
 * Data transfer object containing the necessary fields to create a new task.
 */
export interface CreateTaskDTO {
  /** The title of the task to create. */
  title: string;
  /** An optional description for the task. */
  description?: string | null;
  /** The optional ID of the user to assign the task to upon creation. */
  assigneeId?: string | null;
}
