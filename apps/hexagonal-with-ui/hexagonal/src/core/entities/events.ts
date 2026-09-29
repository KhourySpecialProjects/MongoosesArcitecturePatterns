/**
 * Represents a domain event that captures a significant state change or occurrence within the domain.
 */
export interface DomainEvent {
  /** The identifier or name for the type of event occurred. */
  eventType: string;
  /** The timestamp when the event occurred. */
  occurredAt: Date;
}

/**
 * Represents an event emitted when a task is assigned to a user.
 */
export interface TaskAssignedEvent extends DomainEvent {
  /** The specific event type discriminator for task assignment. */
  eventType: "TaskAssigned";
  /** The unique identifier of the assigned task. */
  taskId: string;
  /** The title of the assigned task. */
  taskTitle: string;
  /** The unique identifier of the user to whom the task is assigned. */
  assigneeId: string;
}
