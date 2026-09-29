import { DomainEvent } from "../../entities/events.js";

/**
 * Driven port interface defining the contract for publishing domain events to messaging systems or event buses.
 */
export interface EventPublisherPort {
  /**
   * Publishes a domain event to all interested subscribers or downstream message handlers.
   *
   * @typeParam T - The concrete type of domain event extending {@link DomainEvent}.
   * @param event - The domain event instance containing event metadata and payload.
   * @returns A promise that resolves when the event publication process has completed.
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;
}
