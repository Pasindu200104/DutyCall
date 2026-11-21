// Import the React type for children.
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

// A white rounded box used to group content. Other components put their content inside it.
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
