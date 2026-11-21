// Import the status and priority lists plus their types.
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../constants/taskOptions";
import type { TaskPriority, TaskStatus } from "../../types/task";

// A small coloured pill that shows the status of a task (with a coloured dot).
export function StatusBadge({ status }: { status: TaskStatus }) {
  const option = STATUS_OPTIONS.find((item) => item.value === status);
  if (!option) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${option.badgeClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${option.dotClass}`} aria-hidden="true" />
      {option.label}
    </span>
  );
}

// A small coloured pill that shows the priority of a task.
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const option = PRIORITY_OPTIONS.find((item) => item.value === priority);
  if (!option) return null;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${option.badgeClass}`}>
      {option.label}
    </span>
  );
}
