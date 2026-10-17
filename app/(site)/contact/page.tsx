import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SimpleHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/layout";
import { getPage, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("contact");

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()]);

  const cards = [
    { icon: Phone, label: "Phone", value: settings.phone, href: settings.phoneHref },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Service area", value: settings.serviceArea },
  ];

  return (
    <>
      <SimpleHero hero={page.hero} crumbs={[{ label: "Contact", href: "/contact" }]} />

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
            {cards.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="bg-white p-6 sm:p-7">
                <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block break-all text-lg font-bold hover:underline sm:text-xl">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-lg font-bold sm:text-xl">{value}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Send us a message</h2>
              <p className="mt-2 text-muted">For a detailed project enquiry, the quote request form is the quickest route.</p>
              <div className="mt-6">
                <ContactForm sourcePage="/contact" />
              </div>
            </div>
            <aside className="space-y-4">
              <h2 className="text-lg font-bold">Looking for a specific service?</h2>
              {[
                { title: "Residential / Home Services", text: "Basements, kitchens, bathrooms and home improvements.", href: "/residential" },
                { title: "Commercial & Industrial", text: "Commercial renovations, office and retail, facility maintenance.", href: "/commercial-industrial" },
                { title: "Request a Quote", text: "Share your project details for a quote.", href: "/request-a-quote" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="group flex items-center justify-between gap-4 rounded-[4px] border border-line p-5 transition-colors hover:border-ink">
                  <span>
                    <span className="block font-bold">{l.title}</span>
                    <span className="mt-1 block text-sm text-muted">{l.text}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
