import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "./JsonLd";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  const color = tone === "light" ? "text-white/75 hover:text-white" : "text-muted hover:text-ink";
  const current = tone === "light" ? "text-white" : "text-ink";
  return (
    <>
      <nav aria-label="Breadcrumb" className={tone === "light" ? "on-dark" : ""}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={current}>
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className={`${color} underline-offset-4 hover:underline`}>
                      {c.label}
                    </Link>
                    <ChevronRight aria-hidden="true" className={`h-3 w-3 ${tone === "light" ? "text-white/50" : "text-subtle"}`} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
    </>
  );
}
