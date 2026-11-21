// A spinning circle with a message. Shown while data is loading (the loading state).
export default function Spinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
