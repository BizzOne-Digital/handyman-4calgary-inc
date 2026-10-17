import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "outline" | "outline-light" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-white border border-ink hover:bg-graphite",
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "on-dark border-[1.5px] border-white text-white hover:bg-white hover:text-ink",
  light: "on-dark bg-white text-ink border border-white hover:bg-mist",
};

export const buttonClass = (variant: Variant = "primary", extra = "") =>
  `group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[3px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-colors duration-200 ${styles[variant]} ${extra}`;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
      {arrow && (
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

/** Underlined text link with arrow, as used under the service groups in the mockup. */
export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 border-b-[1.5px] border-ink pb-1 text-sm font-semibold text-ink ${className}`}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
