import { DIVISIONS, OTHER_SERVICE, groupsFor, type Division } from "@/lib/constants";

export type ServiceOption = { value: string; label: string; group: string };
export type ServiceOptions = Record<Division, ServiceOption[]>;

/** Quote-form options from published services, ordered by group, plus "Other / Not sure". */
export function buildServiceOptions(services: { key: string; title: string; division: Division; group: string }[]): ServiceOptions {
  const out = {} as ServiceOptions;
  for (const d of DIVISIONS) {
    const opts: ServiceOption[] = [];
    for (const g of groupsFor(d)) {
      for (const s of services.filter((x) => x.division === d && x.group === g.key)) {
        opts.push({ value: s.key, label: s.title, group: g.shortTitle });
      }
    }
    opts.push({ ...OTHER_SERVICE[d], group: "" });
    out[d] = opts;
  }
  return out;
}
