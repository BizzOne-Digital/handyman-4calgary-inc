import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SimpleHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/layout";
import { DIVISIONS, SERVICE_OPTIONS, type Division } from "@/lib/constants";
import { getPage, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("request-a-quote");

type Search = Promise<Record<string, string | string[] | undefined>>;

/** Accepts only known division/service values from the query string. */
function readPrefill(sp: Record<string, string | string[] | undefined>) {
  const raw = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const d = raw("division");
  const division = d && (DIVISIONS as readonly string[]).includes(d) ? (d as Division) : undefined;
  const s = raw("service");
  const service = division && s && SERVICE_OPTIONS[division].some((o) => o.value === s) ? s : undefined;
  return { division, service };
}

export default async function RequestQuotePage({ searchParams }: { searchParams: Search }) {
  const [page, settings, sp] = await Promise.all([getPage("request-a-quote"), getSettings(), searchParams]);
  const { division, service } = readPrefill(sp);

  return (
    <>
      <SimpleHero hero={page.hero} crumbs={[{ label: "Request a Quote", href: "/request-a-quote" }]} />
      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="rounded-[4px] border border-line p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Project details</h2>
            <p className="mt-1 text-sm text-muted">The more detail you share, the more useful our first conversation will be.</p>
            <div className="mt-6">
              <QuoteForm key={`${division ?? ""}-${service ?? ""}`} variant="full" sourcePage="/request-a-quote" defaultDivision={division} defaultService={service} />
            </div>
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="on-dark rounded-[4px] bg-charcoal p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">Prefer to talk?</h2>
              <p className="mt-2 text-sm text-white/75">Call or email and we will discuss your project directly.</p>
              <ul className="mt-6 space-y-3">
                <li>
                  <a href={settings.phoneHref} className="flex min-h-11 items-center gap-3 text-lg font-semibold hover:underline">
                    <Phone aria-hidden="true" className="h-5 w-5" /> {settings.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="flex min-h-11 items-center gap-3 break-all hover:underline">
                    <Mail aria-hidden="true" className="h-5 w-5 shrink-0" /> {settings.email}
                  </a>
                </li>
                <li className="flex min-h-11 items-center gap-3 text-white/80">
                  <MapPin aria-hidden="true" className="h-5 w-5" /> {settings.serviceArea}
                </li>
              </ul>
            </div>
            <div className="rounded-[4px] border border-line p-6 sm:p-8">
              <Clock aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
              <h2 className="mt-4 text-lg font-bold">What happens next</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
                <li>Your request is saved and you receive a reference number.</li>
                <li>We review the details and contact you using your preferred method.</li>
                <li>Where useful, we arrange a time to see the property.</li>
                <li>We prepare a quote based on the agreed scope.</li>
              </ol>
            </div>
            <p className="text-sm text-muted">
              Not sure which service fits?{" "}
              <Link href="/residential" className="font-semibold text-ink underline underline-offset-4">Residential</Link> or{" "}
              <Link href="/commercial-industrial" className="font-semibold text-ink underline underline-offset-4">Commercial &amp; Industrial</Link>.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
