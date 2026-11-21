// Import the router helpers, task data and components used on the details page.
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import TaskDetails from "../components/tasks/TaskDetails";

// The page for one task at /tasks/:taskId.
export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, isLoading, errorMessage, reloadTasks } = useTasks();

  // Find the task with the id from the address.
  const task = tasks.find((item) => item.id === Number(taskId));

  if (isLoading) return <Spinner message="Loading task..." />;
  if (errorMessage) return <ErrorState message={errorMessage} onRetry={reloadTasks} />;
  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="This task does not exist or was deleted."
        action={<Link to="/tasks"><Button>Back to the list</Button></Link>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Task details" action={<Link to="/tasks"><Button variant="secondary">Back to list</Button></Link>} />
      <Card>
        <TaskDetails task={task} onDeleted={() => navigate("/tasks")} />
      </Card>
    </div>
  );
}
