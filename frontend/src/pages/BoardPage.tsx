// Import the router helpers, task data and components used on the board.
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import { STATUS_OPTIONS } from "../constants/taskOptions";
import type { TaskStatus } from "../types/task";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import BoardColumn from "../components/tasks/BoardColumn";
import TaskSidePanel from "../components/tasks/TaskSidePanel";

// The board page: one column per status. Cards can be dragged between columns.
// The route is /board, or /board/:taskId which also opens the details side panel.
export default function BoardPage() {
  const { tasks, isLoading, errorMessage, reloadTasks, changeTaskStatus } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const selectedTaskId = taskId ? Number(taskId) : null;

  // Called when a card is dropped in a column. It saves the new status and shows a message.
  async function handleDropTask(droppedTaskId: number, status: TaskStatus) {
    const task = tasks.find((item) => item.id === droppedTaskId);
    if (!task || task.status === status) return;

    try {
      await changeTaskStatus(droppedTaskId, status);
      const statusLabel = STATUS_OPTIONS.find((option) => option.value === status)?.label;
      showToast(`Moved to ${statusLabel}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not move the task.", "error");
    }
  }

  // Opening a card changes the address to /board/:taskId, which opens the side panel.
  function handleOpenTask(clickedTaskId: number) {
    navigate(`/board/${clickedTaskId}`);
  }

  // The screens shown before the real board: loading, error and empty.
  if (isLoading) return <Spinner message="Loading the board..." />;
  if (errorMessage) return <ErrorState message={errorMessage} onRetry={reloadTasks} />;
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Your board is empty"
        description="Create a task and it will appear in the To do column."
        action={<Link to="/tasks/new"><Button>Create a task</Button></Link>}
      />
    );
  }

  return (
    <div>
      <PageHeader title="Board" subtitle="Drag a card to another column to change its status. Select a card to see its details." />

      {/* The columns sit side by side and scroll sideways on small screens. */}
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        {STATUS_OPTIONS.map((option) => (
          <BoardColumn
            key={option.value}
            status={option.value}
            tasks={tasks.filter((task) => task.status === option.value)}
            selectedTaskId={selectedTaskId}
            onOpenTask={handleOpenTask}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      {/* The side panel is only drawn when a task id is in the address. */}
      {selectedTaskId !== null && <TaskSidePanel taskId={selectedTaskId} />}
    </div>
  );
}
