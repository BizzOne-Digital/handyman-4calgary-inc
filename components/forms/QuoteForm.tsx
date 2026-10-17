"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitQuote } from "@/app/actions/enquiries";
import { CONTACT_METHOD_LABELS, CONTACT_METHODS, DIVISION_LABELS, SERVICE_OPTIONS, type Division } from "@/lib/constants";
import { flattenErrors, quoteSchema, type FieldErrors } from "@/lib/validation/enquiry";
import { Field, Honeypot, RadioGroup, focusFirstError } from "./fields";

type Props = {
  variant?: "compact" | "full";
  defaultDivision?: Division;
  defaultService?: string;
  sourcePage: string;
  title?: string;
};

type Values = {
  name: string;
  email: string;
  phone: string;
  division: Division | "";
  service: string;
  address: string;
  message: string;
  preferredContact: (typeof CONTACT_METHODS)[number];
  preferredDate: string;
};

export function QuoteForm({ variant = "full", defaultDivision, defaultService, sourcePage, title }: Props) {
  const full = variant === "full";
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    division: defaultDivision ?? "residential",
    service: defaultService ?? "",
    address: "",
    message: "",
    preferredContact: "either",
    preferredDate: "",
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const services = useMemo(() => (values.division ? SERVICE_OPTIONS[values.division] : []), [values.division]);
  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "division" && !SERVICE_OPTIONS[v as Division].some((s) => s.value === prev.service)) next.service = "";
      return next;
    });
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    const payload = { ...values, website, startedAt: startedAt.current, sourcePage };
    const check = quoteSchema.safeParse(payload);
    if (!check.success) {
      setErrors(flattenErrors(check.error));
      focusFirstError(formRef.current);
      return;
    }
    startTransition(async () => {
      try {
        const res = await submitQuote(payload);
        if (res.ok) {
          setReference(res.reference);
          toast.success("Your request has been sent.", { description: `Reference ${res.reference}` });
          requestAnimationFrame(() => successRef.current?.focus());
        } else {
          setErrors(res.fieldErrors ?? {});
          setFormError(res.message);
          toast.error(res.message);
          if (res.fieldErrors) focusFirstError(formRef.current);
        }
      } catch {
        const msg = "We could not send your request. Please check your connection and try again.";
        setFormError(msg);
        toast.error(msg);
      }
    });
  };

  if (reference) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="py-4 text-center outline-none sm:py-8">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10" strokeWidth={1.5} />
        <h3 className="mt-4 text-2xl font-bold">Thank you. Your request has been received.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your reference number is <strong className="text-ink">{reference}</strong>. We will review your project details and
          follow up using your preferred contact method.
          {values.preferredDate && " Your preferred consultation date is a request only. We will confirm any appointment with you directly."}
        </p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative" aria-busy={pending}>
      {title && <h3 className="mb-5 text-2xl font-bold">{title}</h3>}
      <Honeypot value={website} onChange={setWebsite} />

      <div className={`grid gap-4 ${full ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        <Field label="Name" required error={errors.name}>
          {(a) => (
            <input
              id={a.id}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              autoComplete="name"
              maxLength={100}
              required
              className="field-input"
              placeholder="Your name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
          )}
        </Field>
        <Field label="Email" required error={errors.email}>
          {(a) => (
            <input
              id={a.id}
              type="email"
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              autoComplete="email"
              maxLength={200}
              required
              className="field-input"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
          )}
        </Field>
        <Field label="Phone" required error={errors.phone} className={full ? "sm:col-span-2" : ""}>
          {(a) => (
            <input
              id={a.id}
              type="tel"
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              autoComplete="tel"
              maxLength={30}
              required
              className="field-input"
              placeholder="403-123-4567"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          )}
        </Field>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <RadioGroup<Division>
          legend="Project type"
          name="division"
          required
          value={values.division}
          error={errors.division}
          onChange={(v) => set("division", v)}
          options={[
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial & Industrial" },
          ]}
        />
        <Field label="Service required" required error={errors.service}>
          {(a) => (
            <select
              id={a.id}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              required
              className="field-input min-h-11"
              value={values.service}
              onChange={(e) => set("service", e.target.value)}
            >
              <option value="">
                {values.division ? `Choose a ${DIVISION_LABELS[values.division].split(" ")[0].toLowerCase()} service` : "Choose a service"}
              </option>
              {services.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Project address" error={errors.address} hint="Helps us understand the location. Not shared publicly.">
          {(a) => (
            <input
              id={a.id}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              autoComplete="street-address"
              maxLength={200}
              className="field-input"
              placeholder="Street address or Calgary community"
              value={values.address}
              onChange={(e) => set("address", e.target.value)}
            />
          )}
        </Field>
        <Field label="Tell us about your project" required error={errors.message}>
          {(a) => (
            <textarea
              id={a.id}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
              required
              maxLength={3000}
              rows={full ? 6 : 4}
              className="field-input resize-y"
              placeholder="Share a few details: the space, what you would like done and any timing you have in mind."
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
            />
          )}
        </Field>
      </div>

      {full && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <RadioGroup
            legend="Preferred contact method"
            name="preferredContact"
            value={values.preferredContact}
            error={errors.preferredContact}
            onChange={(v) => set("preferredContact", v)}
            options={CONTACT_METHODS.map((m) => ({ value: m, label: CONTACT_METHOD_LABELS[m] }))}
          />
          <Field
            label="Preferred consultation date"
            error={errors.preferredDate}
            hint="A preference only. We will confirm any appointment with you."
          >
            {(a) => (
              <input
                id={a.id}
                type="date"
                min={today}
                aria-describedby={a.describedBy}
                aria-invalid={a.invalid}
                className="field-input min-h-11"
                value={values.preferredDate}
                onChange={(e) => set("preferredDate", e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {formError && (
        <p role="alert" className="mt-5 rounded-[3px] border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-6 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[3px] bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-graphite disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Request <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-subtle">Fields marked * are required.</p>
    </form>
  );
}
