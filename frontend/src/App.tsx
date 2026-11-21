// Import the router tools, the providers and every page.
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { TaskProvider } from "./context/TaskContext";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import TaskListPage from "./pages/TaskListPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import EditTaskPage from "./pages/EditTaskPage";
import NotFoundPage from "./pages/NotFoundPage";

// The whole app: shared data providers, then the routes (which page shows for which address).
export default function App() {
  return (
    <ToastProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Every page is drawn inside AppLayout (sidebar, header, footer). */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/:taskId" element={<BoardPage />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/new" element={<CreateTaskPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
              <Route path="/tasks/:taskId/edit" element={<EditTaskPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </ToastProvider>
  );
}
