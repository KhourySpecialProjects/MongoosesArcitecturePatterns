import { InProcessEventBusAdapter } from "../../src/adapters/driven/messaging/in-process-event-bus.adapter.js";
import { TaskAssignedEvent } from "../../src/core/entities/events.js";

describe("InProcessEventBusAdapter (Unit)", () => {
  let eventBus: InProcessEventBusAdapter;

  beforeEach(() => {
    eventBus = new InProcessEventBusAdapter();
  });

  it("publishes events to registered subscribers", async () => {
    const received: TaskAssignedEvent[] = [];

    eventBus.subscribe("TaskAssigned", (event: TaskAssignedEvent) => {
      received.push(event);
    });

    const event: TaskAssignedEvent = {
      eventType: "TaskAssigned",
      taskId: "task-1",
      taskTitle: "Test Title",
      assigneeId: "user-1",
      occurredAt: new Date(),
    };

    await eventBus.publish(event);

    expect(received.length).toBe(1);
    expect(received[0].taskId).toBe("task-1");
  });

  it("does not invoke handlers subscribed to different event types", async () => {
    const wrongHandler = jest.fn();
    eventBus.subscribe("OtherEvent", wrongHandler);

    await eventBus.publish({
      eventType: "TaskAssigned",
      taskId: "task-1",
      taskTitle: "Test Title",
      assigneeId: "user-1",
      occurredAt: new Date(),
    });

    expect(wrongHandler).not.toHaveBeenCalled();
  });

  it("allows unsubscribing", async () => {
    const handler = jest.fn();
    const unsubscribe = eventBus.subscribe("TaskAssigned", handler);

    await eventBus.publish({
      eventType: "TaskAssigned",
      taskId: "task-1",
      taskTitle: "Test Title",
      assigneeId: "user-1",
      occurredAt: new Date(),
    });
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();

    await eventBus.publish({
      eventType: "TaskAssigned",
      taskId: "task-2",
      taskTitle: "Test Title 2",
      assigneeId: "user-2",
      occurredAt: new Date(),
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
