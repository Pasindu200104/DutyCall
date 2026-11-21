// Import the router link that highlights the page you are on.
import { NavLink } from "react-router-dom";

// The pages shown in the menu. "end" makes the Dashboard link active only on exactly "/".
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/board", label: "Board", end: false },
  { to: "/tasks", label: "Task list", end: false },
];

interface SidebarProps {
  onNavigate: () => void;
}

// The dark menu on the left with the DutyCall name and the page links.
export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-ink px-4 py-6 text-white">
      {/* The site name. */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg font-extrabold">D</span>
        <span className="text-xl font-extrabold tracking-tight">DutyCall</span>
      </div>

      {/* One link for each page. */}
      <nav aria-label="Main menu" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-brand text-white" : "text-indigo-100 hover:bg-ink-soft"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <p className="mt-auto px-2 text-xs text-indigo-200">Keep every duty on call.</p>
    </div>
  );
}
