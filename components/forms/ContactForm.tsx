"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions/enquiries";
import type { Division } from "@/lib/constants";
import { contactSchema, flattenErrors, type FieldErrors } from "@/lib/validation/enquiry";
import { Field, Honeypot, RadioGroup, focusFirstError } from "./fields";

type Values = { name: string; email: string; phone: string; division: Division | ""; message: string };

export function ContactForm({ sourcePage }: { sourcePage: string }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", division: "", message: "" });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    const payload = { ...values, website, startedAt: startedAt.current, sourcePage };
    const check = contactSchema.safeParse(payload);
    if (!check.success) {
      setErrors(flattenErrors(check.error));
      focusFirstError(formRef.current);
      return;
    }
    startTransition(async () => {
      try {
        const res = await submitContact(payload);
        if (res.ok) {
          setReference(res.reference);
          toast.success("Your message has been sent.", { description: `Reference ${res.reference}` });
          requestAnimationFrame(() => successRef.current?.focus());
        } else {
          setErrors(res.fieldErrors ?? {});
          setFormError(res.message);
          toast.error(res.message);
        }
      } catch {
        const msg = "We could not send your message. Please check your connection and try again.";
        setFormError(msg);
        toast.error(msg);
      }
    });
  };

  if (reference) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="py-8 text-center outline-none">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10" strokeWidth={1.5} />
        <h3 className="mt-4 text-2xl font-bold">Thank you. Your message has been received.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Your reference number is <strong className="text-ink">{reference}</strong>. We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative" aria-busy={pending}>
      <Honeypot value={website} onChange={setWebsite} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          {(a) => (
            <input id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="name" maxLength={100}
              className="field-input" value={values.name} onChange={(e) => set("name", e.target.value)} />
          )}
        </Field>
        <Field label="Email" required error={errors.email}>
          {(a) => (
            <input id={a.id} type="email" aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="email" maxLength={200}
              className="field-input" value={values.email} onChange={(e) => set("email", e.target.value)} />
          )}
        </Field>
        <Field label="Phone" error={errors.phone} className="sm:col-span-2">
          {(a) => (
            <input id={a.id} type="tel" aria-describedby={a.describedBy} aria-invalid={a.invalid} autoComplete="tel" maxLength={30}
              className="field-input" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          )}
        </Field>
      </div>
      <div className="mt-5">
        <RadioGroup<Division>
          legend="This is about (optional)"
          name="division"
          value={values.division}
          onChange={(v) => set("division", v)}
          options={[
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial & Industrial" },
          ]}
        />
      </div>
      <div className="mt-4">
        <Field label="Message" required error={errors.message}>
          {(a) => (
            <textarea id={a.id} aria-describedby={a.describedBy} aria-invalid={a.invalid} rows={6} maxLength={3000}
              className="field-input resize-y" placeholder="How can we help?" value={values.message}
              onChange={(e) => set("message", e.target.value)} />
          )}
        </Field>
      </div>
      {formError && (
        <p role="alert" className="mt-5 rounded-[3px] border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[3px] bg-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-graphite disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Message <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
