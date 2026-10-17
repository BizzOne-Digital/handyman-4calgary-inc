"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/** Button that asks for confirmation in an accessible modal before running a destructive action. */
export function ConfirmButton({
  children,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      ref.current?.close();
    }
  };

  return (
    <>
      <button type="button" disabled={disabled} onClick={() => ref.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="confirm-title"
        className="m-auto w-[min(92vw,420px)] rounded-[4px] border border-line p-0 backdrop:bg-black/50"
        onClick={(e) => e.target === ref.current && !busy && ref.current?.close()}
      >
        <div className="p-6">
          <h2 id="confirm-title" className="text-lg font-bold">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted">{description}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              disabled={busy}
              onClick={() => ref.current?.close()}
              className="inline-flex min-h-10 items-center rounded-[3px] border border-line px-4 text-sm font-medium hover:border-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={run}
              className="inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-danger px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
