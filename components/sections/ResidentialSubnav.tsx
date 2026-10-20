import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { groupsFor } from "@/lib/constants";

const LINKS = [{ label: "Overview", href: "/residential" }, ...groupsFor("residential").map((g) => ({ label: g.shortTitle, href: g.path }))];

/** Keeps the residential service pages one click apart, with in-page links to each service. */
export function ResidentialSubnav({ current, services = [] }: { current: string; services?: { key: string; title: string }[] }) {
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
      {services.length > 1 && (
        <div className="border-t border-line bg-mist">
          <Container>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" aria-label="On this page">
              {services.map((s) => (
                <li key={s.key} className="shrink-0">
                  <a href={`#${s.key}`} className="inline-flex min-h-9 items-center whitespace-nowrap rounded-[3px] border border-line bg-white px-3 text-[13px] font-medium hover:border-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </nav>
  );
}
