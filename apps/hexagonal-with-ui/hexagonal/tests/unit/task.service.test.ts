import { InProcessEventBusAdapter } from "../../src/adapters/driven/messaging/in-process-event-bus.adapter.js";
import { NotFoundError, ValidationError } from "../../src/core/errors/domain-errors.js";
import { TaskService } from "../../src/core/services/task.service.js";
import { InMemoryTaskRepository, InMemoryUserRepository } from "../helpers.js";

describe("TaskService (Unit)", () => {
  let userRepo: InMemoryUserRepository;
  let taskRepo: InMemoryTaskRepository;
  let eventBus: InProcessEventBusAdapter;
  let taskService: TaskService;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    taskRepo = new InMemoryTaskRepository(userRepo);
    eventBus = new InProcessEventBusAdapter();
    taskService = new TaskService(taskRepo, userRepo, eventBus);
  });

  describe("createTask", () => {
    it("creates an unassigned task", async () => {
      const task = await taskService.createTask({
        title: "Clean Code",
        description: "Refactor domain services",
      });

      expect(task).toHaveProperty("id");
      expect(task.title).toBe("Clean Code");
      expect(task.description).toBe("Refactor domain services");
      expect(task.assigneeId).toBeNull();
      expect(task.status).toBe("todo");
    });

    it("creates an assigned task and emits TaskAssignedEvent", async () => {
      const user = await userRepo.save({
        name: "Bob",
        email: "bob@example.com",
      });

      const publishedEvents: any[] = [];
      eventBus.subscribe("TaskAssigned", (event) => {
        publishedEvents.push(event);
      });

      const task = await taskService.createTask({
        title: "Deploy app",
        assigneeId: user.id,
      });

      expect(task.assigneeId).toBe(user.id);
      expect(publishedEvents.length).toBe(1);
      expect(publishedEvents[0]).toMatchObject({
        eventType: "TaskAssigned",
        taskId: task.id,
        taskTitle: "Deploy app",
        assigneeId: user.id,
      });
    });

    it("throws ValidationError when title is missing", async () => {
      await expect(
        taskService.createTask({ title: "" })
      ).rejects.toThrow(ValidationError);
      await expect(
        taskService.createTask({ title: "   " })
      ).rejects.toThrow("title is required");
    });

    it("throws ValidationError when assigneeId does not exist", async () => {
      await expect(
        taskService.createTask({
          title: "Invalid Assignee",
          assigneeId: "unknown-user-id",
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        taskService.createTask({
          title: "Invalid Assignee",
          assigneeId: "unknown-user-id",
        })
      ).rejects.toThrow("assigneeId does not exist");
    });
  });

  describe("assignTask", () => {
    it("assigns an existing task to an existing user and emits TaskAssignedEvent", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      const task = await taskService.createTask({
        title: "Initial unassigned task",
      });

      const publishedEvents: any[] = [];
      eventBus.subscribe("TaskAssigned", (event) => {
        publishedEvents.push(event);
      });

      const updated = await taskService.assignTask(task.id, user.id);
      expect(updated.assigneeId).toBe(user.id);

      expect(publishedEvents.length).toBe(1);
      expect(publishedEvents[0]).toMatchObject({
        eventType: "TaskAssigned",
        taskId: task.id,
        taskTitle: "Initial unassigned task",
        assigneeId: user.id,
      });
    });

    it("throws NotFoundError when task does not exist", async () => {
      const user = await userRepo.save({
        name: "Alice",
        email: "alice@example.com",
      });

      await expect(
        taskService.assignTask("non-existent-task-id", user.id)
      ).rejects.toThrow(NotFoundError);

      await expect(
        taskService.assignTask("non-existent-task-id", user.id)
      ).rejects.toThrow("Task not found");
    });

    it("throws ValidationError when assignee does not exist", async () => {
      const task = await taskService.createTask({
        title: "Task with bad assignee",
      });

      await expect(
        taskService.assignTask(task.id, "non-existent-user-id")
      ).rejects.toThrow(ValidationError);

      await expect(
        taskService.assignTask(task.id, "non-existent-user-id")
      ).rejects.toThrow("assigneeId does not exist");
    });

    it("throws ValidationError when assigneeId is missing", async () => {
      const task = await taskService.createTask({
        title: "Task without assignee",
      });

      await expect(taskService.assignTask(task.id, "")).rejects.toThrow(
        "assigneeId is required"
      );
    });
  });

  describe("listTasks & getTaskById", () => {
    it("lists all tasks with populated assignee", async () => {
      const user = await userRepo.save({
        name: "Charlie",
        email: "charlie@example.com",
      });

      await taskService.createTask({
        title: "Task 1",
        assigneeId: user.id,
      });
      await taskService.createTask({
        title: "Task 2",
      });

      const list = await taskService.listTasks();
      expect(list.length).toBe(2);
      const assigned = list.find((t) => t.title === "Task 1");
      expect(assigned?.assignee?.name).toBe("Charlie");
    });

    it("gets task by id", async () => {
      const task = await taskService.createTask({
        title: "Get by id task",
      });

      const found = await taskService.getTaskById(task.id);
      expect(found).not.toBeNull();
      expect(found?.title).toBe("Get by id task");
    });
  });
});
