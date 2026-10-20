import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

/** Sticky call / quote actions on small screens, so click-to-call is always one tap away. */
export function MobileActionBar({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={phoneHref}
          aria-label={`Call ${phone}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[3px] border-[1.5px] border-ink text-sm font-semibold text-ink"
        >
          <Phone aria-hidden="true" className="h-4 w-4" /> Call now
        </a>
        <Link href="/request-a-quote" className="flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-ink text-sm font-semibold text-white">
          Get a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
