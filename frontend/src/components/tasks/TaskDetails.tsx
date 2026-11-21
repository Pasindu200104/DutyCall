// Import the React tools, router helpers, types and components used for the details view.
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../constants/taskOptions";
import { formatDate, isOverdue } from "../../utils/dateHelpers";
import { useTasks } from "../../context/TaskContext";
import { useToast } from "../../context/ToastContext";
import { SelectInput } from "../ui/FormField";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import TaskComments from "./TaskComments";

interface TaskDetailsProps {
  task: Task;
  onDeleted: () => void;
}

// Shows everything about one task. It is used inside the board side panel and on the details page.
export default function TaskDetails({ task, onDeleted }: TaskDetailsProps) {
  const { updateTask, changeTaskStatus, deleteTask } = useTasks();
  const { showToast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  // Change the status from the drop down (also useful on phones where dragging is hard).
  async function handleStatusChange(status: TaskStatus) {
    try {
      await changeTaskStatus(task.id, status);
      showToast("Status updated.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not update the status.", "error");
    }
  }

  // Change the priority from the drop down.
  async function handlePriorityChange(priority: TaskPriority) {
    try {
      await updateTask(task.id, { priority });
      showToast("Priority updated.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not update the priority.", "error");
    }
  }

  // Delete the task after the user confirmed in the dialog.
  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      showToast("Task deleted.");
      onDeleted();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete the task.", "error");
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">{task.title}</h2>
        <p className="mt-1 text-xs text-gray-500">Created on {formatDate(task.createdAt)}</p>
      </div>

      {/* Quick change of status and priority. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectInput id={`status-${task.id}`} label="Status" value={task.status} onChange={(event) => handleStatusChange(event.target.value as TaskStatus)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectInput>
        <SelectInput id={`priority-${task.id}`} label="Priority" value={task.priority} onChange={(event) => handlePriorityChange(event.target.value as TaskPriority)}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectInput>
      </div>

      {/* Assignee and due date. */}
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="font-semibold text-gray-700">Assignee</dt>
          <dd className="mt-1 flex items-center gap-2 text-gray-600"><Avatar name={task.assignee} />{task.assignee}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-700">Due date</dt>
          <dd className={`mt-1 ${overdue ? "font-semibold text-red-600" : "text-gray-600"}`}>
            {formatDate(task.dueDate)}{overdue && " (overdue)"}
          </dd>
        </div>
      </dl>

      <div>
        <h3 className="text-sm font-bold text-gray-800">Description</h3>
        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
          {task.description || "No description was added."}
        </p>
      </div>

      <div className="flex gap-3">
        <Link to={`/tasks/${task.id}/edit`}>
          <Button variant="secondary">Edit task</Button>
        </Link>
        <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>Delete task</Button>
      </div>

      <hr className="border-gray-200" />
      <TaskComments taskId={task.id} />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete this task?"
        message={`"${task.title}" and its comments will be removed. This cannot be undone.`}
        confirmLabel="Delete task"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
