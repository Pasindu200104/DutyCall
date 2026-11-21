// Import the reusable button.
import Button from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// Shown when something fails. It says what went wrong and offers a "Try again" button.
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-base font-bold text-red-800">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="danger" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
