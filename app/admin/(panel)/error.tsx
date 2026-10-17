"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="rounded-[4px] border border-danger/30 bg-white p-6">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        The admin page could not be loaded. Check the database connection and try again.
        {error.digest && <span className="block pt-1 text-xs text-subtle">Error reference: {error.digest}</span>}
      </p>
      <button type="button" onClick={reset} className="mt-4 inline-flex min-h-10 items-center rounded-[3px] bg-ink px-4 text-sm font-semibold text-white">
        Try again
      </button>
    </div>
  );
}
