// Import the router link, the empty message and the button.
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

// Shown when the address does not match any page (the 404 page).
export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you are looking for does not exist."
      action={<Link to="/"><Button>Go to the dashboard</Button></Link>}
    />
  );
}
