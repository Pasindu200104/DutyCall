// Import the router helpers, task data, the form and other components.
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import type { TaskInput } from "../types/task";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import TaskForm from "../components/tasks/TaskForm";

// The page at /tasks/:taskId/edit where an existing task is changed.
export default function EditTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, isLoading, errorMessage, reloadTasks, updateTask } = useTasks();
  const { showToast } = useToast();
  const task = tasks.find((item) => item.id === Number(taskId));

  if (isLoading) return <Spinner message="Loading task..." />;
  if (errorMessage) return <ErrorState message={errorMessage} onRetry={reloadTasks} />;
  if (!task) {
    return (
      <EmptyState title="Task not found" description="This task does not exist or was deleted." action={<Link to="/tasks"><Button>Back to the list</Button></Link>} />
    );
  }

  // Save the changes, show a success message and go back to the task.
  async function handleSubmit(values: TaskInput) {
    await updateTask(task!.id, values);
    showToast("Task updated.");
    navigate(`/tasks/${task!.id}`);
  }

  // Start the form with the values the task has now.
  const initialValues: TaskInput = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    dueDate: task.dueDate,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit task" />
      <Card>
        <TaskForm initialValues={initialValues} isNewTask={false} submitLabel="Save changes" cancelPath={`/tasks/${task.id}`} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
