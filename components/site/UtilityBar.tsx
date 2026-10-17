import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettingsData } from "@/models/SiteSettings";

export function UtilityBar({ settings }: { settings: SiteSettingsData }) {
  return (
    <div className="on-dark bg-charcoal text-white">
      <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between gap-4 px-4 text-[13px] sm:px-6 lg:px-10">
        <p className="flex items-center gap-1.5 text-white/85">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 sm:hidden" />
          Serving {settings.serviceArea}
        </p>
        <div className="flex items-center gap-5">
          <a href={settings.phoneHref} className="flex items-center gap-2 font-medium hover:text-white/80">
            <Phone aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="hidden items-center gap-2 hover:text-white/80 md:flex">
            <Mail aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{settings.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
