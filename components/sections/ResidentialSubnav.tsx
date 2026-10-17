import Link from "next/link";
import { Container } from "@/components/ui/layout";

const LINKS = [
  { label: "Overview", href: "/residential" },
  { label: "Basement Development", href: "/residential/basement-development" },
  { label: "Kitchen & Bathroom", href: "/residential/kitchen-bathroom-renovations" },
  { label: "Home Improvements & Maintenance", href: "/residential/home-improvements-maintenance" },
];

/** Keeps the residential service pages one click apart. */
export function ResidentialSubnav({ current }: { current: string }) {
  return (
    <nav aria-label="Residential services" className="border-b border-line bg-white">
      <Container>
        <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {LINKS.map((l) => {
            const active = l.href === current;
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-12 items-center whitespace-nowrap px-3 text-sm transition-colors ${
                    active ? "font-semibold text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                  {active && <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[2px] bg-ink" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
