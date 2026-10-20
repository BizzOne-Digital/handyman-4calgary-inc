export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const DIVISIONS = ["residential", "commercial"] as const;
export type Division = (typeof DIVISIONS)[number];
export const DIVISION_LABELS: Record<Division, string> = {
  residential: "Residential / Home Services",
  commercial: "Commercial & Industrial",
};

export const ENQUIRY_STATUSES = ["new", "contacted", "in_progress", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  closed: "Closed",
};

export const CONTACT_METHODS = ["phone", "email", "either"] as const;
export const CONTACT_METHOD_LABELS: Record<(typeof CONTACT_METHODS)[number], string> = {
  phone: "Phone",
  email: "Email",
  either: "Either",
};

/**
 * Service groups. Each residential group has its own page; commercial groups are sections
 * of /commercial-industrial. Services (admin-managed) belong to exactly one group.
 */
export const SERVICE_GROUPS = [
  {
    key: "res-renovations",
    division: "residential",
    title: "Kitchen, Bathroom & Basement Renovations",
    shortTitle: "Renovations",
    path: "/residential/renovations",
    summary: "Kitchen, basement and general renovations, bathroom and washroom remodels, and interior demolition.",
  },
  {
    key: "res-finishing",
    division: "residential",
    title: "Flooring, Painting, Doors & Carpentry",
    shortTitle: "Flooring, Painting & Carpentry",
    path: "/residential/flooring-painting-carpentry",
    summary: "Flooring installation and repairs, painting and drywall, doors and windows, carpentry and general repairs.",
  },
  {
    key: "res-systems",
    division: "residential",
    title: "Plumbing, Electrical & Property Maintenance",
    shortTitle: "Plumbing, Electrical & Maintenance",
    path: "/residential/plumbing-electrical-maintenance",
    summary: "Plumbing and electrical services, and ongoing maintenance for homes and rental properties.",
  },
  {
    key: "com-projects",
    division: "commercial",
    title: "Renovations & Construction",
    shortTitle: "Renovations & Construction",
    path: "/commercial-industrial#renovations-construction",
    summary: "Commercial renovations and tenant improvements, washroom renovations, demolition and general construction.",
  },
  {
    key: "com-trades",
    division: "commercial",
    title: "Commercial Trade Services",
    shortTitle: "Trade Services",
    path: "/commercial-industrial#trade-services",
    summary: "Flooring, painting and drywall, doors and windows, carpentry, plumbing and electrical for commercial spaces.",
  },
  {
    key: "com-maintenance",
    division: "commercial",
    title: "Property & Facility Maintenance",
    shortTitle: "Facility Maintenance",
    path: "/commercial-industrial#maintenance",
    summary: "Repairs, building upkeep and ongoing maintenance for commercial and industrial properties.",
  },
] as const satisfies readonly { key: string; division: Division; title: string; shortTitle: string; path: string; summary: string }[];

export type ServiceGroupKey = (typeof SERVICE_GROUPS)[number]["key"];
export const SERVICE_GROUP_KEYS = SERVICE_GROUPS.map((g) => g.key) as unknown as readonly [ServiceGroupKey, ...ServiceGroupKey[]];
export const groupsFor = (division: Division) => SERVICE_GROUPS.filter((g) => g.division === division);
export const getGroup = (key: string) => SERVICE_GROUPS.find((g) => g.key === key);

/** Anchor link to a service within its group page. */
export function serviceHref(group: string, key: string) {
  const g = getGroup(group);
  if (!g) return "/";
  return `${g.path.split("#")[0]}#${key}`;
}

/** "Other / not sure" option offered in quote forms for each division. */
export const OTHER_SERVICE: Record<Division, { value: string; label: string }> = {
  residential: { value: "other-residential", label: "Other / Not sure" },
  commercial: { value: "other-commercial", label: "Other / Not sure" },
};

/** Labels for service values stored on older enquiries (before the service restructure). */
const LEGACY_SERVICE_LABELS: Record<string, string> = {
  "basement-development": "Basement Development",
  "kitchen-renovation": "Kitchen Renovation",
  "bathroom-renovation": "Bathroom Renovation",
  "home-improvements": "Home Improvements & Repairs",
  "property-maintenance": "Ongoing Property Maintenance",
  "office-retail": "Office & Retail Improvements",
  "facility-maintenance": "Facility & Industrial Maintenance",
  "maintenance-contract": "Ongoing Maintenance Contract",
  "other-residential": "Other / Not sure",
  "other-commercial": "Other / Not sure",
};

/** Readable label for a stored service value when no title snapshot exists. */
export function serviceLabel(value?: string | null) {
  if (!value) return "";
  return LEGACY_SERVICE_LABELS[value] ?? value.replace(/-/g, " ").replace(/^w/, (c) => c.toUpperCase());
}

export const PAGE_SLUGS = [
  "home",
  "residential",
  "residential-renovations",
  "residential-finishing",
  "residential-systems",
  "commercial-industrial",
  "about",
  "projects",
  "request-a-quote",
  "contact",
] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

export const PAGE_PATHS: Record<PageSlug, string> = {
  home: "/",
  residential: "/residential",
  "residential-renovations": "/residential/renovations",
  "residential-finishing": "/residential/flooring-painting-carpentry",
  "residential-systems": "/residential/plumbing-electrical-maintenance",
  "commercial-industrial": "/commercial-industrial",
  about: "/about",
  projects: "/projects",
  "request-a-quote": "/request-a-quote",
  contact: "/contact",
};

export const PAGE_NAMES: Record<PageSlug, string> = {
  home: "Home",
  residential: "Residential / Home Services",
  "residential-renovations": "Residential › Renovations",
  "residential-finishing": "Residential › Flooring, Painting & Carpentry",
  "residential-systems": "Residential › Plumbing, Electrical & Maintenance",
  "commercial-industrial": "Commercial & Industrial",
  about: "About",
  projects: "Projects / Gallery",
  "request-a-quote": "Request a Quote",
  contact: "Contact",
};

/** Which service group each residential service page shows. */
export const GROUP_PAGE: Partial<Record<PageSlug, ServiceGroupKey>> = {
  "residential-renovations": "res-renovations",
  "residential-finishing": "res-finishing",
  "residential-systems": "res-systems",
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://handyman4calgary.com").replace(/\/$/, "");
