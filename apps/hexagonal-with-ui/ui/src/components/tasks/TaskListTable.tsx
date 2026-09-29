import { STRINGS } from "../../constants/strings";
import { TaskWithAssignee } from "../../types/task.types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

/**
 * Props for the TaskListTable component.
 */
export interface TaskListTableProps {
  /** Array of tasks with assignee details. */
  tasks: TaskWithAssignee[];
  /** Whether the task list is loading. */
  isLoading: boolean;
  /** Callback fired when user selects a task for detailed inspection. */
  onSelectTask: (taskId: string) => void;
  /** Optional callback fired when user selects a task for assignment. */
  onAssignTask?: (taskId: string) => void;
  /** Callback to trigger a data refresh. */
  onRefresh: () => void;
}

/**
 * Table component displaying all tasks with their statuses and assignee details.
 *
 * @param props - TaskListTableProps configuration.
 * @returns A rendered table component wrapped in a card.
 */
export function TaskListTable({
  tasks,
  isLoading,
  onSelectTask,
  onAssignTask,
  onRefresh,
}: TaskListTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "success";
      case "in_progress":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <Card
      title={STRINGS.TASKS.LIST_TITLE}
      actions={
        <Button variant="outline" size="sm" onClick={onRefresh} isLoading={isLoading}>
          {STRINGS.COMMON.REFRESH}
        </Button>
      }
    >
      {isLoading && tasks.length === 0 ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message={STRINGS.TASKS.LIST_EMPTY} />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{STRINGS.COMMON.ID}</th>
                <th>{STRINGS.TASKS.DETAIL_TITLE_LABEL}</th>
                <th>{STRINGS.COMMON.STATUS}</th>
                <th>{STRINGS.TASKS.CREATE_ASSIGNEE_LABEL}</th>
                <th>{STRINGS.COMMON.CREATED_AT}</th>
                <th>{STRINGS.COMMON.ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="mono">{task.id}</td>
                  <td>
                    <strong>{task.title}</strong>
                  </td>
                  <td>
                    <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  </td>
                  <td>
                    {task.assignee ? (
                      <span>{task.assignee.name}</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>{STRINGS.COMMON.UNASSIGNED}</span>
                    )}
                  </td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectTask(task.id)}
                      >
                        {STRINGS.TASKS.VIEW_TASK_BUTTON}
                      </Button>
                      {onAssignTask ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onAssignTask(task.id)}
                        >
                          {STRINGS.TASKS.QUICK_ASSIGN_BUTTON}
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
