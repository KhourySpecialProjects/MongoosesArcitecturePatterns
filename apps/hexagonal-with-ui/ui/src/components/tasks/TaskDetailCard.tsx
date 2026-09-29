import { STRINGS } from "../../constants/strings";
import { TaskWithAssignee } from "../../types/task.types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

/**
 * Props for the TaskDetailCard component.
 */
export interface TaskDetailCardProps {
  /** The task entity loaded with assignee information. */
  task: TaskWithAssignee;
  /** Callback fired when the user closes the card. */
  onClose: () => void;
  /** Optional callback fired when the user clicks to assign this task. */
  onAssignClick?: (taskId: string) => void;
}

/**
 * Card component displaying detailed information of a task including populated assignee details.
 *
 * @param props - TaskDetailCardProps configuration.
 * @returns A rendered task detail card element.
 */
export function TaskDetailCard({
  task,
  onClose,
  onAssignClick,
}: TaskDetailCardProps) {
  const createdDate = new Date(task.createdAt).toLocaleString();
  const updatedDate = new Date(task.updatedAt).toLocaleString();

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
      title={STRINGS.TASKS.DETAIL_TITLE}
      actions={
        <Button variant="outline" size="sm" onClick={onClose}>
          {STRINGS.COMMON.CLOSE}
        </Button>
      }
    >
      <div className="detail-row">
        <span className="detail-label">{STRINGS.COMMON.ID}:</span>
        <span className="detail-value mono">{task.id}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.TASKS.DETAIL_TITLE_LABEL}:</span>
        <span className="detail-value">
          <strong>{task.title}</strong>
        </span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.TASKS.DETAIL_DESC_LABEL}:</span>
        <span className="detail-value">{task.description || STRINGS.COMMON.NOT_AVAILABLE}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.TASKS.DETAIL_STATUS_LABEL}:</span>
        <span className="detail-value">
          <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
        </span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.COMMON.CREATED_AT}:</span>
        <span className="detail-value">{createdDate}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.COMMON.UPDATED_AT}:</span>
        <span className="detail-value">{updatedDate}</span>
      </div>

      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          {STRINGS.TASKS.DETAIL_ASSIGNEE_TITLE}
        </h4>
        {task.assignee ? (
          <div>
            <div className="detail-row">
              <span className="detail-label">{STRINGS.USERS.DETAIL_NAME}:</span>
              <span className="detail-value">{task.assignee.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{STRINGS.USERS.DETAIL_EMAIL}:</span>
              <span className="detail-value">{task.assignee.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{STRINGS.USERS.DETAIL_ID}:</span>
              <span className="detail-value mono">{task.assignee.id}</span>
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
            {STRINGS.TASKS.DETAIL_NO_ASSIGNEE}
          </p>
        )}

        {onAssignClick ? (
          <div style={{ marginTop: "0.75rem" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignClick(task.id)}
            >
              {STRINGS.TASKS.ASSIGN_TITLE}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
