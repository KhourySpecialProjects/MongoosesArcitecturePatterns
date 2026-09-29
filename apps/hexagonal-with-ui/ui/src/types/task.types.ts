import { User } from "./user.types";

/**
 * Domain entity representing a task in the system.
 */
export interface Task {
  /** The unique identifier of the task. */
  id: string;
  /** The title of the task. */
  title: string;
  /** Optional description details of the task. */
  description: string | null;
  /** Current status of the task. */
  status: string;
  /** Identifier of the assigned user or null if unassigned. */
  assigneeId: string | null;
  /** Timestamp when the task was created. */
  createdAt: string;
  /** Timestamp when the task was last updated. */
  updatedAt: string;
}

/**
 * Task entity extended with populated assignee user information.
 */
export interface TaskWithAssignee extends Task {
  /** The user assigned to the task, or null if unassigned. */
  assignee: User | null;
}

/**
 * Payload required to create a new task.
 */
export interface CreateTaskPayload {
  /** The title of the task. */
  title: string;
  /** Optional detailed description. */
  description?: string;
  /** Optional assignee user ID. */
  assigneeId?: string;
}

/**
 * Payload required to assign an existing task to a user.
 */
export interface AssignTaskPayload {
  /** The user ID to assign the task to. */
  assigneeId: string;
}
