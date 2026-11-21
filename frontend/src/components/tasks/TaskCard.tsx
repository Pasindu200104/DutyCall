// Import the types, helpers and small components used inside the card.
import type { Task } from "../../types/task";
import { formatDate, isOverdue } from "../../utils/dateHelpers";
import { PriorityBadge } from "../ui/Badge";
import Avatar from "../ui/Avatar";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onOpen: (taskId: number) => void;
}

// A small card for one task on the board. It can be dragged to another column.
export default function TaskCard({ task, isSelected, onOpen }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  // When dragging starts, store the task id so the column that receives the card knows which task it is.
  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", String(task.id));
    event.dataTransfer.effectAllowed = "move";
  }

  // Let keyboard users open the card with the Enter or Space key.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(task.id);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onOpen(task.id)}
      onKeyDown={handleKeyDown}
      aria-label={`Open task ${task.title}`}
      className={`cursor-grab rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
        isSelected ? "border-brand ring-2 ring-brand/30" : "border-gray-200"
      }`}
    >
      <p className="text-sm font-semibold text-gray-900">{task.title}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <Avatar name={task.assignee} />
      </div>

      {/* The due date turns red when the task is overdue. */}
      <p className={`mt-2 text-xs font-medium ${overdue ? "text-red-600" : "text-gray-500"}`}>
        {overdue ? "Overdue: " : "Due: "}
        {formatDate(task.dueDate)}
      </p>
    </div>
  );
}
