# DutyCall - Task Management Dashboard

DutyCall is a modern, responsive task management dashboard.
It was built for the Pied Piper Innovation Software Engineering Intern (Full-Stack & UI/UX) assignment.

## Features

- **Dashboard**: total, in progress, completed and overdue counts, tasks by status, open tasks by priority and the next tasks due.
- **Board view**: four columns (To do, In progress, Review, Completed). Drag a card to another column to change its status. Select a card to open the details side panel.
- **Task list**: search, filter by status and priority, sorting, and pagination.
- **Task details**: a full page (`/tasks/:taskId`) and a side panel on the board, both with comments.
- **Create, edit and delete** tasks with client-side validation and a delete confirmation.
- **UI states**: loading spinners, error messages with a "Try again" button, empty states, and success or error toast messages.
- **Responsive**: works on desktop, tablet and mobile (slide-in menu, sideways scrolling board, stacked rows).
- **Accessible**: labelled form fields, `aria-invalid` and `aria-describedby` for errors, keyboard access for cards and dialogs, visible focus ring, reduced motion support.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router |
| Styling | Tailwind CSS |
| Mock API | JSON Server (`backend` folder) |

## Setup and run

You need **Node.js 18 or newer**. Open two terminals.

**Terminal 1 - backend (mock API on port 4000)**

```bash
cd backend
npm install
npm start
```

**Terminal 2 - frontend (app on port 5173)**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To use a different API address, copy `frontend/.env.example` to `frontend/.env` and change `VITE_API_URL`.

To check the types and create a production build: `cd frontend && npm run build`.

## Routes

| Address | Page |
| --- | --- |
| `/` | Dashboard |
| `/board` | Board view |
| `/board/:taskId` | Board view with the task details side panel open |
| `/tasks` | Task list with search, filters, sorting and pagination |
| `/tasks/new` | Create a task |
| `/tasks/:taskId` | Task details page |
| `/tasks/:taskId/edit` | Edit a task |
| `*` | 404 page |

## Project structure

```
dutycall/
  backend/                 Mock API
    db.json                  Tasks and comments (the "database")
    package.json             Starts JSON Server on port 4000
  frontend/
    src/
      types/                 TypeScript types (Task, TaskInput, TaskComment)
      constants/             Status, priority and team member lists
      services/              API layer: apiClient, taskService, commentService
      context/               Shared state: TaskContext and ToastContext
      hooks/                 useTaskList (search, filter, sort, pagination)
      utils/                 Pure helpers: dates, validation, filtering and sorting
      components/
        ui/                  Reusable pieces: Button, Card, Badge, Avatar, FormField,
                             Spinner, ErrorState, EmptyState, ConfirmDialog,
                             Pagination, PageHeader, StatCard
        layout/              AppLayout, Sidebar, Header, Footer
        tasks/               TaskCard, BoardColumn, TaskForm, TaskDetails,
                             TaskSidePanel, TaskComments
      pages/                 One file for each route
      App.tsx                Providers and routes
      main.tsx               Entry point
```

## Architectural decisions

1. **Separate backend and frontend folders.** The frontend only knows the API address, so the mock API can be swapped for a real server.
2. **Service layer.** Components never call `fetch` directly. All requests go through `services/apiClient.ts`, which turns network and server failures into friendly `ApiError` messages. `taskService` and `commentService` describe what the app can ask the API.
3. **State management with React Context.** `TaskContext` loads tasks once and is the single source of truth for the dashboard, board and list, so a change made in one place shows everywhere. It uses only React, so no extra library is needed for an app of this size.
4. **Optimistic drag and drop.** When a card is dropped, the screen updates immediately and the request is sent in the background. If the request fails, the card jumps back and an error message is shown.
5. **Native drag and drop.** The HTML5 drag and drop API avoids an extra dependency. Because dragging is difficult on touch screens, the status can also be changed with the Status drop down in the details panel.
6. **Reusable components.** Visual pieces live in `components/ui`. `TaskDetails` is used by both the side panel and the details page, and `TaskForm` is used for both creating and editing.
7. **Separation of concerns.** Pages put things together, components draw the screen, hooks and utils hold the logic (filtering, sorting, validation), and services talk to the API.
8. **Validation.** `utils/validateTask.ts` is a plain function, so it is easy to test. The form shows one message per field and server errors in a separate alert.
9. **Error handling.** Every async action is wrapped in try/catch and ends in an error state with retry, a form error, or an error toast.

## Screenshots


