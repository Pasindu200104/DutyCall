// Turn a date like "2026-11-24" into a readable text like "24 Nov 2026".
export function formatDate(dateText: string): string {
  const date = new Date(dateText);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Turn a full time stamp into a readable date and time for comments.
export function formatDateTime(dateText: string): string {
  const date = new Date(dateText);
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// Get today's date as text in the form "2026-11-21" (used for date inputs and comparisons).
export function getTodayText(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// A task is overdue when its due date is before today and it is not completed yet.
export function isOverdue(dueDate: string, status: string): boolean {
  return status !== "completed" && dueDate < getTodayText();
}

// Get the first letters of a name, for example "Nimali Perera" becomes "NP".
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
