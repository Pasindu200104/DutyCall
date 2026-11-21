// Import the reusable card.
import Card from "./Card";

interface StatCardProps {
  label: string;
  value: number;
  accentClass: string;
}

// A card with one number and a label, used on the dashboard (for example "Total tasks 14").
export default function StatCard({ label, value, accentClass }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${accentClass}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-gray-900">{value}</p>
    </Card>
  );
}
