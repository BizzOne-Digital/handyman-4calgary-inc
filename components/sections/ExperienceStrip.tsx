import { HardHat, MapPin, Users } from "lucide-react";
import { Container } from "@/components/ui/layout";

const ITEMS = [
  { icon: Users, text: "Approximately 20 years of construction experience in Canada" },
  { icon: HardHat, text: "Project-based solutions" },
  { icon: MapPin, text: "Serving Calgary" },
];

export function ExperienceStrip() {
  return (
    <section aria-label="Why Handyman 4 Calgary" className="border-b border-line bg-white">
      <Container>
        <ul className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {ITEMS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5 py-4 sm:justify-center sm:px-4 sm:py-5">
              <Icon aria-hidden="true" className="h-[22px] w-[22px] shrink-0" strokeWidth={1.8} />
              <span className="text-sm font-medium leading-snug text-graphite">{text}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
