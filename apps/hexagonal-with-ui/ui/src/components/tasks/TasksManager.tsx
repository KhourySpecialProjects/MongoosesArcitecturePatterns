import { STRINGS } from "../../constants/strings";
import { useAssignTask } from "../../hooks/useAssignTask";
import { useCreateTask } from "../../hooks/useCreateTask";
import { useTaskDetail } from "../../hooks/useTaskDetail";
import { useTasks } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { AlertBanner } from "../common/AlertBanner";
import { SectionHeader } from "../common/SectionHeader";
import { TaskAssignForm } from "./TaskAssignForm";
import { TaskCreationForm } from "./TaskCreationForm";
import { TaskDetailCard } from "./TaskDetailCard";
import { TaskListTable } from "./TaskListTable";
import { TaskLookupForm } from "./TaskLookupForm";

/**
 * High-level orchestration component for the Task Management module.
 *
 * @returns A rendered layout coordinating task creation, assignment, inspection, and listing.
 */
export function TasksManager() {
  const tasksHook = useTasks();
  const usersHook = useUsers();
  const taskDetailHook = useTaskDetail();

  const createTaskHook = useCreateTask({
    onSuccess: async () => {
      await tasksHook.refetch();
    },
  });

  const assignTaskHook = useAssignTask({
    onSuccess: async (updatedTask) => {
      await tasksHook.refetch();
      if (taskDetailHook.task && taskDetailHook.task.id === updatedTask.id) {
        await taskDetailHook.loadTaskById(updatedTask.id);
      }
    },
  });

  const handleStartAssign = (taskId: string) => {
    assignTaskHook.setTaskId(taskId);
  };

  return (
    <div>
      <SectionHeader
        title={STRINGS.TASKS.SECTION_TITLE}
        subtitle="Manage task lifecycles, user assignments, and task inspection"
      />

      {tasksHook.error ? (
        <AlertBanner variant="error">{tasksHook.error}</AlertBanner>
      ) : null}

      {taskDetailHook.error ? (
        <AlertBanner variant="error" onDismiss={taskDetailHook.clearTask}>
          {taskDetailHook.error}
        </AlertBanner>
      ) : null}

      <div className="grid-two-col">
        <div>
          <TaskCreationForm
            title={createTaskHook.title}
            description={createTaskHook.description}
            assigneeId={createTaskHook.assigneeId}
            users={usersHook.users}
            isSubmitting={createTaskHook.isSubmitting}
            error={createTaskHook.error}
            successMessage={createTaskHook.successMessage}
            onTitleChange={createTaskHook.setTitle}
            onDescriptionChange={createTaskHook.setDescription}
            onAssigneeIdChange={createTaskHook.setAssigneeId}
            onSubmit={createTaskHook.handleSubmit}
            onReset={createTaskHook.resetForm}
          />

          <TaskAssignForm
            taskId={assignTaskHook.taskId}
            assigneeId={assignTaskHook.assigneeId}
            tasks={tasksHook.tasks}
            users={usersHook.users}
            isSubmitting={assignTaskHook.isSubmitting}
            error={assignTaskHook.error}
            successMessage={assignTaskHook.successMessage}
            onTaskIdChange={assignTaskHook.setTaskId}
            onAssigneeIdChange={assignTaskHook.setAssigneeId}
            onSubmit={assignTaskHook.handleAssign}
            onReset={assignTaskHook.resetForm}
          />
        </div>

        <div>
          <TaskLookupForm
            searchId={taskDetailHook.searchId}
            isLoading={taskDetailHook.isLoading}
            onSearchIdChange={taskDetailHook.setSearchId}
            onSubmit={taskDetailHook.handleLookup}
          />

          {taskDetailHook.task ? (
            <TaskDetailCard
              task={taskDetailHook.task}
              onClose={taskDetailHook.clearTask}
              onAssignClick={handleStartAssign}
            />
          ) : null}
        </div>
      </div>

      <TaskListTable
        tasks={tasksHook.tasks}
        isLoading={tasksHook.isLoading}
        onSelectTask={taskDetailHook.loadTaskById}
        onAssignTask={handleStartAssign}
        onRefresh={tasksHook.refetch}
      />
    </div>
  );
}
