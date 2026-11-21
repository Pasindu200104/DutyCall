// Import the React type for children.
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

// Shown when there is nothing to display yet. It explains why and suggests what to do next.
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <h2 className="text-base font-bold text-gray-800">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
