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

/** Service options offered in quote forms, keyed by division. Values are stable slugs. */
export const SERVICE_OPTIONS: Record<Division, { value: string; label: string }[]> = {
  residential: [
    { value: "basement-development", label: "Basement Development" },
    { value: "kitchen-renovation", label: "Kitchen Renovation" },
    { value: "bathroom-renovation", label: "Bathroom Renovation" },
    { value: "home-improvements", label: "Home Improvements & Repairs" },
    { value: "property-maintenance", label: "Ongoing Property Maintenance" },
    { value: "other-residential", label: "Other / Not Sure" },
  ],
  commercial: [
    { value: "commercial-renovations", label: "Commercial Renovations / Tenant Improvements" },
    { value: "office-retail", label: "Office & Retail Improvements" },
    { value: "facility-maintenance", label: "Facility & Industrial Maintenance" },
    { value: "maintenance-contract", label: "Ongoing Maintenance Contract" },
    { value: "other-commercial", label: "Other / Not Sure" },
  ],
};

export function serviceLabel(value?: string | null) {
  if (!value) return "";
  for (const d of DIVISIONS) {
    const hit = SERVICE_OPTIONS[d].find((s) => s.value === value);
    if (hit) return hit.label;
  }
  return value;
}

export const PAGE_SLUGS = [
  "home",
  "residential",
  "basement-development",
  "kitchen-bathroom-renovations",
  "home-improvements-maintenance",
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
  "basement-development": "/residential/basement-development",
  "kitchen-bathroom-renovations": "/residential/kitchen-bathroom-renovations",
  "home-improvements-maintenance": "/residential/home-improvements-maintenance",
  "commercial-industrial": "/commercial-industrial",
  about: "/about",
  projects: "/projects",
  "request-a-quote": "/request-a-quote",
  contact: "/contact",
};

export const PAGE_NAMES: Record<PageSlug, string> = {
  home: "Home",
  residential: "Residential / Home Services",
  "basement-development": "Basement Development",
  "kitchen-bathroom-renovations": "Kitchen & Bathroom Renovations",
  "home-improvements-maintenance": "Home Improvements & Maintenance",
  "commercial-industrial": "Commercial & Industrial",
  about: "About",
  projects: "Projects / Gallery",
  "request-a-quote": "Request a Quote",
  contact: "Contact",
};


export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://handyman4calgary.com").replace(/\/$/, "");
