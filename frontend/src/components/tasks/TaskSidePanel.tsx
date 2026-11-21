// Import the React tools, router helper, task data and the details component.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TaskContext";
import TaskDetails from "./TaskDetails";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

// The panel that slides in from the right on the board and shows the details of the clicked task.
export default function TaskSidePanel({ taskId }: { taskId: number }) {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const task = tasks.find((item) => item.id === taskId);

  // Go back to the plain board, which closes the panel.
  function closePanel() {
    navigate("/board");
  }

  // Close the panel when the Escape key is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") navigate("/board");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-40">
      {/* The dark area behind the panel. Clicking it closes the panel. */}
      <div className="absolute inset-0 bg-black/30" onClick={closePanel} aria-hidden="true" />

      <aside role="dialog" aria-label="Task details" className="animate-slide-in absolute inset-y-0 right-0 w-full overflow-y-auto bg-white p-5 shadow-2xl sm:w-[440px]">
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" onClick={closePanel} aria-label="Close task details">Close</Button>
        </div>

        {task ? (
          <TaskDetails task={task} onDeleted={closePanel} />
        ) : (
          <EmptyState title="Task not found" description="This task may have been deleted." />
        )}
      </aside>
    </div>
  );
}
