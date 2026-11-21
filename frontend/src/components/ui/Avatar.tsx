// Import the helper that turns a name into initials.
import { getInitials } from "../../utils/dateHelpers";

// A round circle with the initials of a person, like the "PD" circles in ClickUp.
export default function Avatar({ name }: { name: string }) {
  return (
    <span
      title={name}
      aria-label={name}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white"
    >
      {getInitials(name)}
    </span>
  );
}
