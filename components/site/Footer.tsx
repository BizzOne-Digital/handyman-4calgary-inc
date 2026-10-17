import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, Globe } from "lucide-react";
import type { SiteSettingsData } from "@/models/SiteSettings";
import { Logo } from "./Logo";

const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Residential", href: "/residential" },
  { label: "Commercial & Industrial", href: "/commercial-industrial" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const RESIDENTIAL = [
  { label: "Basement Development", href: "/residential/basement-development" },
  { label: "Kitchen & Bathroom Renovations", href: "/residential/kitchen-bathroom-renovations" },
  { label: "Home Improvements & Maintenance", href: "/residential/home-improvements-maintenance" },
];

const COMMERCIAL = [
  { label: "Commercial Renovations", href: "/commercial-industrial#commercial-renovations" },
  { label: "Office & Retail Improvements", href: "/commercial-industrial#office-retail" },
  { label: "Facility & Industrial Maintenance", href: "/commercial-industrial#facility-maintenance" },
];

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, youtube: Youtube, google: Globe };
const SOCIAL_LABELS = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", youtube: "YouTube", google: "Google Business Profile" };

export function Footer({ settings }: { settings: SiteSettingsData }) {
  const socials = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter((k) =>
    /^https:\/\//.test(settings.social?.[k] ?? ""),
  );
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo src={settings.logoUrl} alt={settings.logoAlt} className="h-24" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{settings.footerText}</p>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-2" aria-label="Social media">
                {socials.map((k) => {
                  const Icon = SOCIAL_ICONS[k];
                  return (
                    <li key={k}>
                      <a
                        href={settings.social[k]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_LABELS[k]}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-line text-ink transition-colors hover:bg-ink hover:text-white"
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <FooterList title="Company" items={FOOTER_NAV} />
          <FooterList title="Residential" items={RESIDENTIAL} />
          <div>
            <FooterList title="Commercial & Industrial" items={COMMERCIAL} />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li className="flex items-center gap-2 text-muted">
              <MapPin aria-hidden="true" className="h-4 w-4 text-ink" /> {settings.serviceArea}
            </li>
            <li>
              <a href={settings.phoneHref} className="flex items-center gap-2 font-semibold hover:underline">
                <Phone aria-hidden="true" className="h-4 w-4" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-muted hover:text-ink hover:underline">
                <Mail aria-hidden="true" className="h-4 w-4 text-ink" /> {settings.email}
              </a>
            </li>
          </ul>
          <div className="flex flex-col gap-2 text-xs text-subtle sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {year} {settings.businessName}. All rights reserved.
            </p>
            <Link href="/request-a-quote" className="font-semibold text-ink underline-offset-4 hover:underline">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink">{title}</h2>
      <ul className="mt-4 space-y-1">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-ink">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
