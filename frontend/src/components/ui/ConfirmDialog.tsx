// Import the React tools and the reusable button.
import { useEffect } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// A pop up that asks "Are you sure?" before something risky like deleting a task.
export default function ConfirmDialog({ isOpen, title, message, confirmLabel, isLoading = false, onConfirm, onCancel }: ConfirmDialogProps) {
  // Close the dialog when the Escape key is pressed.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
