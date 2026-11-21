// Import the router link and the reusable button.
import { Link } from "react-router-dom";
import Button from "../ui/Button";

interface HeaderProps {
  onMenuClick: () => void;
}

// The white bar at the top. It has a menu button (mobile only) and the "New task" button.
export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        {/* Three lines icon. */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="font-extrabold text-ink lg:hidden">DutyCall</span>
      <span className="hidden text-sm text-gray-500 lg:block">Welcome back, Pasindu</span>

      <Link to="/tasks/new">
        <Button>+ New task</Button>
      </Link>
    </header>
  );
}
