// Import the React tools, types and components used by a column.
import { useState } from "react";
import type { Task, TaskStatus } from "../../types/task";
import { STATUS_OPTIONS } from "../../constants/taskOptions";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  selectedTaskId: number | null;
  onOpenTask: (taskId: number) => void;
  onDropTask: (taskId: number, status: TaskStatus) => void;
}

// One column of the board (for example "In progress") that holds task cards and accepts dropped cards.
export default function BoardColumn({ status, tasks, selectedTaskId, onOpenTask, onDropTask }: BoardColumnProps) {
  // Remember whether a card is being dragged over this column, so we can highlight it.
  const [isDragOver, setIsDragOver] = useState(false);
  const option = STATUS_OPTIONS.find((item) => item.value === status);

  // preventDefault tells the browser "yes, you may drop here".
  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  // When the card is dropped, read the task id and tell the board which column received it.
  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    if (taskId) {
      onDropTask(taskId, status);
    }
  }

  return (
    <section
      aria-label={`${option?.label} column`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex w-72 shrink-0 flex-col rounded-xl p-3 transition-colors ${option?.columnClass} ${
        isDragOver ? "outline-2 outline-dashed outline-brand" : ""
      }`}
    >
      {/* Column title with a task counter. */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2.5 w-2.5 rounded-full ${option?.dotClass}`} aria-hidden="true" />
        <h2 className="text-sm font-bold text-gray-800">{option?.label}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600">{tasks.length}</span>
      </div>

      {/* The cards, or a hint when the column is empty. */}
      <div className="flex min-h-24 flex-col gap-2">
        {tasks.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
            No tasks here. Drag a card into this column.
          </p>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} isSelected={task.id === selectedTaskId} onOpen={onOpenTask} />
        ))}
      </div>
    </section>
  );
}
