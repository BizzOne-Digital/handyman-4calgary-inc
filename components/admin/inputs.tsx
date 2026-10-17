"use client";

import { useId } from "react";
import { Loader2 } from "lucide-react";

type Base = { label: string; error?: string; hint?: string; required?: boolean; className?: string };

function Wrap({ label, error, hint, required, className = "", id, count, max, children }: Base & { id: string; count?: number; max?: number; children: React.ReactNode }) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        {max !== undefined && count !== undefined && (
          <span className={`text-[11px] ${count > max ? "text-danger" : "text-subtle"}`}>
            {count}/{max}
          </span>
        )}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  [error ? `${id}-err` : "", hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;

export function TextInput({
  value,
  onChange,
  maxLength,
  type = "text",
  placeholder,
  ...base
}: Base & { value: string; onChange: (v: string) => void; maxLength?: number; type?: string; placeholder?: string }) {
  const id = useId();
  return (
    <Wrap {...base} id={id} count={value.length} max={maxLength}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength ? maxLength + 50 : undefined}
        aria-invalid={Boolean(base.error)}
        aria-describedby={describedBy(id, base.error, base.hint)}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
    </Wrap>
  );
}

export function TextArea({
  value,
  onChange,
  maxLength,
  rows = 3,
  ...base
}: Base & { value: string; onChange: (v: string) => void; maxLength?: number; rows?: number }) {
  const id = useId();
  return (
    <Wrap {...base} id={id} count={value.length} max={maxLength}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        aria-invalid={Boolean(base.error)}
        aria-describedby={describedBy(id, base.error, base.hint)}
        onChange={(e) => onChange(e.target.value)}
        className="field-input resize-y"
      />
    </Wrap>
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
  ...base
}: Base & { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  const id = useId();
  return (
    <Wrap {...base} id={id}>
      <select
        id={id}
        value={value}
        aria-invalid={Boolean(base.error)}
        onChange={(e) => onChange(e.target.value as T)}
        className="field-input min-h-11"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function Checkbox({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-medium">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#111112]" />
        {label}
      </label>
      {hint && <p className="ml-7 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Panel({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-[4px] border border-line bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export function SubmitButton({
  pending,
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled,
}: {
  pending?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls =
    variant === "primary"
      ? "bg-ink text-white hover:bg-graphite border-ink"
      : "bg-white text-ink border-line hover:border-ink";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending || disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${cls}`}
    >
      {pending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-success/10 text-success border-success/30",
    draft: "bg-mist text-muted border-line",
    new: "bg-ink text-white border-ink",
    contacted: "bg-mist text-ink border-line",
    in_progress: "bg-amber-50 text-amber-900 border-amber-200",
    closed: "bg-white text-subtle border-line",
    changes: "bg-amber-50 text-amber-900 border-amber-200",
  };
  const label: Record<string, string> = {
    published: "Published",
    draft: "Draft",
    new: "New",
    contacted: "Contacted",
    in_progress: "In Progress",
    closed: "Closed",
    changes: "Unpublished changes",
  };
  return (
    <span className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[11px] font-semibold ${map[status] ?? "border-line"}`}>
      {label[status] ?? status}
    </span>
  );
}
