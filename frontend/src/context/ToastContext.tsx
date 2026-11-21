// Import the React tools we need to share toast messages across the whole app.
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// A toast is a small message that appears for a few seconds (success or error).
interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// The function other components call to show a toast.
interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error") => void;
}

// Create the shared box that holds the toast function.
const ToastContext = createContext<ToastContextValue | null>(null);

// The provider wraps the app, keeps the list of toasts and draws them on screen.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a toast to the list and remove it again after 4 seconds.
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* aria-live makes screen readers announce new messages. */}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// A small helper hook so components can write useToast() to get the toast function.
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
