export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse space-y-4">
      <div className="h-8 w-56 rounded-[3px] bg-line" />
      <div className="h-4 w-80 rounded-[3px] bg-line" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[4px] bg-white" />
        ))}
      </div>
      <div className="h-64 rounded-[4px] bg-white" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
