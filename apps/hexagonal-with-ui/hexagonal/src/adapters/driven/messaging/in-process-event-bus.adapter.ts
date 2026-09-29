import { DomainEvent } from "../../../core/entities/events.js";
import { EventPublisherPort } from "../../../core/ports/driven/event-publisher.port.js";

/**
 * Type definition for event handler callback functions.
 */
type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

/**
 * In-memory event bus adapter implementing {@link EventPublisherPort}.
 * Manages in-process publish/subscribe messaging to decouple cross-domain workflows.
 */
export class InProcessEventBusAdapter implements EventPublisherPort {
  private readonly handlers = new Map<string, EventHandler<any>[]>();

  /**
   * Initializes a new instance of the InProcessEventBusAdapter with an empty event handler registry.
   */
  constructor() {}

  /**
   * Registers a subscriber callback function for a given domain event type.
   *
   * @typeParam T - The concrete type of domain event.
   * @param eventType - The string identifier of the event to listen for.
   * @param handler - The callback function to execute when the event occurs.
   * @returns An unsubscribe function that removes the registered handler when invoked.
   */
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    const existing = this.handlers.get(eventType) ?? [];
    existing.push(handler);
    this.handlers.set(eventType, existing);

    return () => {
      const current = this.handlers.get(eventType) ?? [];
      this.handlers.set(
        eventType,
        current.filter((h) => h !== handler)
      );
    };
  }

  /**
   * Publishes a domain event by sequentially executing all handlers registered for the event's type.
   *
   * @typeParam T - The concrete type of domain event.
   * @param event - The domain event instance to publish.
   * @returns A promise that resolves when all registered handlers have finished execution.
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const registeredHandlers = this.handlers.get(event.eventType) ?? [];
    for (const handler of registeredHandlers) {
      await handler(event);
    }
  }

  /**
   * Clears all registered event handlers from the bus.
   */
  clear(): void {
    this.handlers.clear();
  }
}
