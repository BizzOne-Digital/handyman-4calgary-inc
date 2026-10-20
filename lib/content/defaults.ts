import type { PageSlug } from "@/lib/constants";
import type { PageData } from "@/models/PageContent";
import type { SiteSettingsData } from "@/models/SiteSettings";
import type { Division, ServiceGroupKey } from "@/lib/constants";
import { IMG } from "./images";

export const DEFAULT_SETTINGS: SiteSettingsData = {
  businessName: "Handyman 4 Calgary",
  tagline: "Renovations, contracting and property maintenance in Calgary.",
  phone: "403-383-7013",
  phoneHref: "tel:+14033837013",
  email: "info@handyman4calgary.com",
  serviceArea: "Calgary, Alberta",
  logoUrl: "/brand/logo.png",
  logoAlt: "Handyman 4 Calgary logo",
  footerText: "Residential renovations, commercial improvements and property maintenance across Calgary, Alberta.",
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", google: "" },
  defaultSeoTitle: "Handyman 4 Calgary | Renovations, Contracting & Property Maintenance",
  defaultSeoDescription:
    "Residential renovations, commercial improvements and industrial building maintenance across Calgary, Alberta. Request a quote today.",
  ogImage: IMG.kitchenPendants,
};

type PartialPage = Omit<PageData, "media" | "faqs" | "intro"> & Partial<Pick<PageData, "media" | "faqs" | "intro">>;
const page = (p: PartialPage): PageData => ({
  intro: { heading: "", body: "" },
  media: [],
  faqs: [],
  ...p,
});

const quoteFaq = {
  question: "How do I get a quote?",
  answer:
    "Send us a short description of your project through the quote form or give us a call. We will review the details, ask any questions we need, and arrange a site visit where it is useful before preparing a quote.",
};

export const DEFAULT_PAGES: Record<PageSlug, PageData> = {
  home: page({
    seoTitle: "Handyman 4 Calgary | Renovations, Contracting & Maintenance",
    seoDescription:
      "Residential renovations, commercial improvements and industrial building maintenance across Calgary. Choose your service area and request a quote.",
    hero: {
      eyebrow: "Renovations • Contracting • Property Maintenance",
      heading: "Your home. Your business.\nBuilt better.",
      description: "Residential renovations, commercial improvements and industrial maintenance across Calgary.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote",
      image: "",
      imageAlt: "",
    },
    intro: {
      heading: "Practical experience.\nProfessional workmanship.",
      body: "From residential renovations to commercial improvements, we deliver practical solutions tailored to your property and your project.",
    },
    media: [
      {
        key: "panel-residential",
        label: "Residential panel image",
        url: IMG.kitchenPendants,
        alt: "Bright renovated kitchen with white cabinets, island seating and black pendant lights",
      },
      {
        key: "panel-commercial",
        label: "Commercial & Industrial panel image",
        url: IMG.warehouse,
        alt: "Large industrial warehouse interior with high ceilings and storage racking",
      },
      {
        key: "about",
        label: "About preview image",
        url: IMG.carpenter,
        alt: "Illustrative image of a construction professional measuring timber framing",
      },
    ],
    faqs: [
      {
        question: "Do you work on both homes and commercial properties?",
        answer:
          "Yes. We have two divisions: Residential / Home Services for homeowners, landlords and residential property owners, and Commercial & Industrial for businesses, property managers, contractors and industrial clients.",
      },
      {
        question: "What size of project do you take on?",
        answer:
          "Our focus is medium-to-large renovation projects, commercial improvements and ongoing property maintenance. Smaller items can be included as part of a larger project or maintenance arrangement.",
      },
      {
        question: "Which areas do you serve?",
        answer: "We serve Calgary, Alberta. If your property is nearby, contact us and we will confirm whether we can help.",
      },
      {
        question: "Do you offer ongoing maintenance?",
        answer:
          "Yes. We discuss recurring maintenance for residential properties as well as commercial and industrial buildings, based on the property and what it needs.",
      },
      quoteFaq,
    ],
  }),

  residential: page({
    seoTitle: "Residential Renovations & Home Services in Calgary",
    seoDescription:
      "Kitchen, bathroom and basement renovations, flooring, painting, doors and windows, plumbing, electrical and property maintenance for Calgary homes.",
    hero: {
      eyebrow: "Residential / Home Services",
      heading: "Renovations, repairs and upkeep for your home.",
      description:
        "From full kitchen, bathroom and basement renovations to flooring, painting, plumbing, electrical and ongoing maintenance, for Calgary homeowners, landlords and residential property owners.",
      ctaLabel: "Request a Residential Quote",
      ctaHref: "/request-a-quote?division=residential",
      image: IMG.openPlan,
      imageAlt: "Open-plan modern living room with large windows and wood accent wall",
    },
    intro: {
      heading: "One contractor for the whole home.",
      body: "Our residential services are grouped into three areas so you can find what you need quickly: renovations, interior finishing and carpentry, and plumbing, electrical and property maintenance. Every project starts with a clear conversation about scope, priorities and the next practical step.",
    },
    faqs: [
      quoteFaq,
      {
        question: "Do you take on small one-off repairs?",
        answer:
          "Our focus is renovation projects, improvement work and ongoing maintenance. Smaller repairs can be included as part of a larger project or a maintenance arrangement for your property.",
      },
      {
        question: "Can you help landlords and rental property owners?",
        answer:
          "Yes. We work with landlords and residential property owners on renovations between tenancies, repairs and ongoing property maintenance.",
      },
      {
        question: "What areas do you serve?",
        answer: "We serve Calgary, Alberta. If your property is nearby, contact us and we will confirm whether we can help.",
      },
    ],
  }),

  "residential-renovations": page({
    seoTitle: "Kitchen, Bathroom & Basement Renovations in Calgary",
    seoDescription:
      "Kitchen, basement and general home renovations, bathroom and washroom remodels and interior demolition in Calgary. Planned, built and finished properly.",
    hero: {
      eyebrow: "Residential / Renovations",
      heading: "Kitchen, bathroom and basement renovations.",
      description:
        "Full renovations planned around how your household lives, from the first conversation through demolition, construction and finishing.",
      ctaLabel: "Request a Renovation Quote",
      ctaHref: "/request-a-quote?division=residential&service=kitchen-basement-renovations",
      image: IMG.kitchenWhite,
      imageAlt: "White kitchen with island seating, pendant lights and a stainless steel range",
    },
    intro: {
      heading: "Renovations that are planned before they are built.",
      body: "We help you decide what to keep, what to change and how to sequence the work. Permits, any licensed trades and the order of work are discussed at the start, so the project runs in a clear order and you know what to expect.",
    },
    faqs: [
      {
        question: "Do renovations need a permit in Calgary?",
        answer:
          "Many renovations, including most basement developments and work that changes plumbing, electrical or structure, require permits. We discuss permit requirements during planning so they are accounted for before work begins.",
      },
      {
        question: "Can I stay in my home during a renovation?",
        answer: "In most cases, yes. We talk through the work sequence so you know which rooms are affected and when.",
      },
      {
        question: "How long does a renovation take?",
        answer:
          "It depends on the size of the space, the layout and the finishes. We provide an expected timeline with your quote once we understand the scope.",
      },
      quoteFaq,
    ],
  }),

  "residential-finishing": page({
    seoTitle: "Flooring, Painting, Drywall, Doors & Carpentry in Calgary",
    seoDescription:
      "Flooring installation and repairs, painting and drywall, door and window services, carpentry and general repairs for Calgary homes.",
    hero: {
      eyebrow: "Residential / Flooring, Painting & Carpentry",
      heading: "Floors, walls, doors and the finishing details.",
      description:
        "Flooring, painting and drywall, doors and windows, and carpentry and repairs that make a home look and work the way it should.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote?division=residential&service=flooring",
      image: IMG.hallwayTrim,
      imageAlt: "Bright hallway with wide-plank wood flooring, white doors and a staircase",
    },
    intro: {
      heading: "Improvements you see every day.",
      body: "These services can be booked on their own or combined into one planned project, which is often the most efficient way to refresh a room, a floor of the house or a rental unit between tenants.",
    },
    faqs: [
      {
        question: "Can you combine flooring, painting and trim into one project?",
        answer:
          "Yes. Combining related work into one planned project avoids repeat visits and helps everything finish in the right order.",
      },
      {
        question: "Do you supply materials or install what I have purchased?",
        answer:
          "Either can work. Tell us in your request what you have in mind and we will confirm what is included in the quote.",
      },
      quoteFaq,
    ],
  }),

  "residential-systems": page({
    seoTitle: "Plumbing, Electrical & Property Maintenance in Calgary",
    seoDescription:
      "Residential plumbing and electrical services and ongoing property maintenance for Calgary homeowners, landlords and residential property owners.",
    hero: {
      eyebrow: "Residential / Plumbing, Electrical & Maintenance",
      heading: "Plumbing, electrical and ongoing maintenance.",
      description:
        "Plumbing and electrical work for renovations and repairs, and ongoing maintenance for homes and rental properties.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote?division=residential&service=residential-plumbing",
      image: IMG.bathroomTub,
      imageAlt: "Bright bathroom with a freestanding tub, vessel sink and large window",
    },
    intro: {
      heading: "Keep your home working properly.",
      body: "Plumbing and electrical work is planned around the permits and licensing it requires, which we confirm with you before work starts. For owners who want one reliable contact, we also offer ongoing maintenance.",
    },
    faqs: [
      {
        question: "Do plumbing and electrical jobs need permits?",
        answer:
          "Some do, depending on the scope. We confirm permit and licensing requirements during planning, before the work is scheduled.",
      },
      {
        question: "Do you offer ongoing maintenance for rental properties?",
        answer:
          "Yes. Tell us about the property and the type of upkeep you need, and we will discuss a practical maintenance arrangement.",
      },
      quoteFaq,
    ],
  }),

  "commercial-industrial": page({
    seoTitle: "Commercial & Industrial Contracting in Calgary",
    seoDescription:
      "Commercial renovations, tenant improvements, demolition and construction, trade services and facility maintenance for Calgary businesses and industrial properties.",
    hero: {
      eyebrow: "Commercial & Industrial",
      heading: "Projects and maintenance for your business.",
      description:
        "Commercial renovations and construction, trade services for offices, retail and industrial spaces, and ongoing property and facility maintenance.",
      ctaLabel: "Request a Commercial Quote",
      ctaHref: "/request-a-quote?division=commercial",
      image: IMG.officeLoft,
      imageAlt: "Open commercial office space with concrete ceiling, meeting table and large windows",
    },
    intro: {
      heading: "Organized around how commercial work is bought.",
      body: "Some work is a defined project, such as a tenant improvement or a washroom renovation. Some is a single trade, such as new flooring or repainting. Some is ongoing upkeep of a building. Our commercial and industrial services are grouped the same way, delivered by one accountable contractor.",
    },
    faqs: [
      {
        question: "Do you work with property managers and general contractors?",
        answer:
          "Yes. We work with business owners, commercial property owners, facility managers, property managers and general contractors.",
      },
      {
        question: "Can work be scheduled around business hours?",
        answer: "We discuss scheduling during planning so work fits your operations as practically as possible.",
      },
      {
        question: "Do you offer ongoing maintenance contracts?",
        answer:
          "Yes. We can discuss recurring maintenance for commercial and industrial properties based on your building and requirements.",
      },
      quoteFaq,
    ],
  }),

  about: page({
    seoTitle: "About Handyman 4 Calgary",
    seoDescription:
      "Handyman 4 Calgary brings approximately 20 years of construction experience in Canada to residential renovations and commercial projects in Calgary.",
    hero: {
      eyebrow: "About Handyman 4 Calgary",
      heading: "Practical experience. Professional workmanship.",
      description:
        "A Calgary renovation, contracting and property maintenance business built on approximately 20 years of construction experience in Canada.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote",
      image: IMG.plans,
      imageAlt: "Contractor reviewing construction drawings with a ruler and pencil",
    },
    intro: {
      heading: "Residential and commercial work under one name.",
      body: "Handyman 4 Calgary serves two kinds of clients: homeowners and residential property owners, and businesses, commercial property owners and industrial clients. The services are different, but the approach is the same: understand the property, plan the work clearly and deliver it properly.",
    },
    media: [
      {
        key: "workmanship",
        label: "Workmanship image",
        url: IMG.carpenter,
        alt: "Illustrative image of a construction professional measuring timber framing",
      },
    ],
  }),

  projects: page({
    seoTitle: "Projects & Gallery | Handyman 4 Calgary",
    seoDescription:
      "Browse residential and commercial project imagery from Handyman 4 Calgary. Filter by Residential or Commercial & Industrial.",
    hero: {
      eyebrow: "Projects / Gallery",
      heading: "The kind of work we do.",
      description:
        "Browse residential and commercial imagery by category. Images marked as illustrative are examples, not completed client projects.",
      ctaLabel: "Start Your Project",
      ctaHref: "/request-a-quote",
      image: "",
      imageAlt: "",
    },
  }),

  "request-a-quote": page({
    seoTitle: "Request a Quote | Handyman 4 Calgary",
    seoDescription:
      "Tell us about your residential or commercial project in Calgary. Share your details and we will follow up to discuss the next step.",
    hero: {
      eyebrow: "Request a Quote",
      heading: "Tell us about your project.",
      description:
        "Share a few details and we will follow up to discuss scope, timing and the next practical step. A preferred consultation date is a preference only. We will confirm any appointment with you directly.",
      ctaLabel: "",
      ctaHref: "",
      image: "",
      imageAlt: "",
    },
  }),

  contact: page({
    seoTitle: "Contact Handyman 4 Calgary",
    seoDescription: "Call 403-383-7013, email info@handyman4calgary.com or send a message. Serving Calgary, Alberta.",
    hero: {
      eyebrow: "Contact",
      heading: "Let's talk about your next project.",
      description: "Call, email or send a message. We will help you take the next step.",
      ctaLabel: "",
      ctaHref: "",
      image: "",
      imageAlt: "",
    },
  }),
};

/** Pages whose hero has a single background/feature image editable in the admin. */
export const PAGES_WITH_HERO_IMAGE: PageSlug[] = [
  "residential",
  "residential-renovations",
  "residential-finishing",
  "residential-systems",
  "commercial-industrial",
  "about",
];

export type DefaultService = {
  key: string;
  division: Division;
  group: ServiceGroupKey;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  order: number;
};

const svc = (s: DefaultService) => s;

/**
 * Initial service catalogue. Services are admin-managed after seeding; images are illustrative
 * placeholders meant to be replaced with the client's own project photos.
 */
export const DEFAULT_SERVICES: DefaultService[] = [
  // ---- Residential: renovations
  svc({
    key: "kitchen-basement-renovations",
    division: "residential",
    group: "res-renovations",
    title: "Kitchen, Basement & General Renovations",
    summary: "Kitchen remodels, basement development and whole-room renovations.",
    description:
      "Kitchen renovations, basement finishing and development, and general renovations across the home. We plan the layout, build the structure and complete the finishing, with permits and sequencing discussed at the start.",
    highlights: ["Kitchen remodels and cabinet installation", "Basement finishing and development", "Layout changes and framing", "Whole-room and multi-room renovations"],
    image: IMG.kitchenPendants,
    imageAlt: "Renovated kitchen with a marble island, black pendant lights and bar seating",
    order: 1,
  }),
  svc({
    key: "bathroom-washroom-renovations",
    division: "residential",
    group: "res-renovations",
    title: "Bathroom & Washroom Renovations",
    summary: "Full bathroom remodels, ensuites and powder rooms.",
    description:
      "Bathroom and washroom renovations that improve layout, storage and finishes, from vanity and tile updates to full remodels. Plumbing and electrical scope is confirmed during planning.",
    highlights: ["Full bathroom remodels", "Ensuites and powder rooms", "Vanities, tile and fixtures", "Showers and tubs"],
    image: IMG.bathroomGlass,
    imageAlt: "Renovated bathroom with a glass shower enclosure and a long wood vanity",
    order: 2,
  }),
  svc({
    key: "residential-demolition",
    division: "residential",
    group: "res-renovations",
    title: "Demolition & General Construction",
    summary: "Interior demolition, framing and construction for renovation projects.",
    description:
      "Careful interior demolition to prepare a space for renovation, followed by framing and general construction to the agreed layout.",
    highlights: ["Interior demolition and removal", "Wall framing", "Preparing spaces for renovation", "General construction"],
    image: IMG.carpenter,
    imageAlt: "Illustrative image of a construction professional measuring timber wall framing",
    order: 3,
  }),

  // ---- Residential: finishing & carpentry
  svc({
    key: "flooring",
    division: "residential",
    group: "res-finishing",
    title: "Flooring Installation & Repairs",
    summary: "New flooring and repairs for every room in the home.",
    description:
      "Installation of new flooring and repairs to existing floors, including preparation, transitions and finishing trim.",
    highlights: ["Hardwood, laminate and vinyl plank", "Tile flooring", "Floor repairs", "Transitions and baseboards"],
    image: IMG.hallwayTrim,
    imageAlt: "Hallway with wide-plank wood flooring, white doors and a staircase",
    order: 1,
  }),
  svc({
    key: "painting-drywall",
    division: "residential",
    group: "res-finishing",
    title: "Painting & Drywall",
    summary: "Interior and exterior painting, drywall installation and repairs.",
    description:
      "Drywall installation, taping and repairs, followed by careful preparation and painting for walls, ceilings, trim and exterior surfaces.",
    highlights: ["Interior and exterior painting", "Drywall installation and taping", "Drywall and ceiling repairs", "Surface preparation"],
    image: IMG.paintRoller,
    imageAlt: "Paint roller applying light grey paint to a white wall",
    order: 2,
  }),
  svc({
    key: "doors-windows",
    division: "residential",
    group: "res-finishing",
    title: "Door & Window Services",
    summary: "Door installation and replacement, window trim and adjustments.",
    description:
      "Interior and exterior door installation and replacement, hardware, adjustments and window trim, finished so they open, close and seal properly.",
    highlights: ["Interior and exterior doors", "Door hardware and adjustments", "Window trim and casing", "Weatherstripping"],
    image: IMG.loungeCorner,
    imageAlt: "Bright room corner with a large window, white walls and a yellow armchair",
    order: 3,
  }),
  svc({
    key: "carpentry-repairs",
    division: "residential",
    group: "res-finishing",
    title: "Carpentry & General Repairs",
    summary: "Finishing carpentry, trim and general repairs around the home.",
    description:
      "Finishing carpentry, baseboards and casing, shelving and built-ins, and general repairs that keep a home in good, safe working condition.",
    highlights: ["Trim, baseboards and casing", "Shelving and built-ins", "Stairs and railings", "General home repairs"],
    image: IMG.toolBelt,
    imageAlt: "Close-up of a leather tool belt holding a hammer and hand tools",
    order: 4,
  }),

  // ---- Residential: plumbing, electrical & maintenance
  svc({
    key: "residential-plumbing",
    division: "residential",
    group: "res-systems",
    title: "Plumbing Services",
    summary: "Fixture installation and plumbing work for renovations and repairs.",
    description:
      "Plumbing for renovations and repairs, such as fixture installation and replacement. Permit and licensing requirements are confirmed during planning.",
    highlights: ["Fixture installation and replacement", "Plumbing for renovations", "Repairs", "Permit requirements confirmed upfront"],
    image: IMG.bathroomTub,
    imageAlt: "Bathroom with a freestanding tub, vessel sink and large window",
    order: 1,
  }),
  svc({
    key: "residential-electrical",
    division: "residential",
    group: "res-systems",
    title: "Electrical Services",
    summary: "Lighting, fixtures and electrical work for renovations and repairs.",
    description:
      "Electrical work for renovations and repairs, such as lighting and fixture installation. Permit and licensing requirements are confirmed during planning.",
    highlights: ["Lighting and fixture installation", "Electrical for renovations", "Repairs", "Permit requirements confirmed upfront"],
    image: IMG.livingRoom,
    imageAlt: "Finished living room with recessed ceiling lighting and a large sectional sofa",
    order: 2,
  }),
  svc({
    key: "residential-property-maintenance",
    division: "residential",
    group: "res-systems",
    title: "Property Maintenance",
    summary: "Ongoing upkeep for homes and rental properties.",
    description:
      "Recurring maintenance and repairs for homeowners, landlords and residential property owners who want one reliable contact for their property.",
    highlights: ["Scheduled maintenance", "Repairs as needs arise", "Turnover work between tenants", "One point of contact"],
    image: IMG.houseExterior,
    imageAlt: "Two-storey house with a stone and timber front porch surrounded by autumn trees",
    order: 3,
  }),

  // ---- Commercial: renovations & construction
  svc({
    key: "commercial-renovations",
    division: "commercial",
    group: "com-projects",
    title: "Commercial Renovations & Tenant Improvements",
    summary: "Renovations and fit-ups for offices, retail and commercial interiors.",
    description:
      "Interior renovations and tenant improvements that prepare commercial spaces for new occupants or new ways of working, including staff kitchens and general renovations.",
    highlights: ["Tenant improvements", "Office and retail renovations", "Staff kitchens and break rooms", "Layout changes"],
    image: IMG.officeCorridor,
    imageAlt: "Commercial office corridor with glass partitions and a polished concrete floor",
    order: 1,
  }),
  svc({
    key: "commercial-washrooms",
    division: "commercial",
    group: "com-projects",
    title: "Washroom Renovations",
    summary: "Renovation of staff and public washrooms in commercial buildings.",
    description:
      "Washroom renovations for offices, retail and commercial buildings, planned to limit disruption to staff and customers. Plumbing scope is confirmed during planning.",
    highlights: ["Staff and public washrooms", "Fixtures, partitions and finishes", "Accessibility improvements", "Scheduled around operations"],
    image: IMG.bathroomGlass,
    imageAlt: "Washroom with a glass shower enclosure, wood vanity and tiled floor",
    order: 2,
  }),
  svc({
    key: "commercial-demolition-construction",
    division: "commercial",
    group: "com-projects",
    title: "Demolition & General Construction",
    summary: "Interior demolition, framing and general construction for commercial projects.",
    description:
      "Interior demolition to prepare commercial and industrial spaces for renovation, followed by framing, partition walls and general construction.",
    highlights: ["Interior demolition", "Partition walls and framing", "General construction", "Site preparation"],
    image: IMG.warehouse,
    imageAlt: "Large open industrial building interior with racking and a high steel roof",
    order: 3,
  }),

  // ---- Commercial: trade services
  svc({
    key: "commercial-flooring",
    division: "commercial",
    group: "com-trades",
    title: "Commercial Flooring",
    summary: "Flooring installation and repairs for commercial spaces.",
    description: "Installation and repair of flooring for offices, retail units and commercial interiors.",
    highlights: ["New flooring installation", "Floor repairs", "Transitions and base", "Scheduled around operations"],
    image: IMG.retailStore,
    imageAlt: "Retail store interior with a polished floor, wall shelving and pendant lighting",
    order: 1,
  }),
  svc({
    key: "commercial-painting-drywall",
    division: "commercial",
    group: "com-trades",
    title: "Painting & Drywall",
    summary: "Repainting, drywall and finishing for commercial interiors.",
    description: "Drywall installation and repairs and interior repainting for offices, retail and common areas.",
    highlights: ["Interior repainting", "Drywall installation and repairs", "Ceilings and common areas", "Touch-ups between tenants"],
    image: IMG.officeLounge,
    imageAlt: "Office lounge with a stone fireplace wall, timber shelving and white armchairs",
    order: 2,
  }),
  svc({
    key: "commercial-doors-windows",
    division: "commercial",
    group: "com-trades",
    title: "Door & Window Services",
    summary: "Commercial doors, hardware and window trim.",
    description: "Installation, replacement and adjustment of interior and exterior commercial doors, hardware and window trim.",
    highlights: ["Interior and exterior doors", "Hardware and closers", "Adjustments and repairs", "Window trim"],
    image: IMG.officeLoft,
    imageAlt: "Open office with glass-walled meeting rooms and large windows",
    order: 3,
  }),
  svc({
    key: "commercial-carpentry-repairs",
    division: "commercial",
    group: "com-trades",
    title: "Carpentry & General Repairs",
    summary: "Millwork, trim and general repairs for commercial properties.",
    description: "Finishing carpentry, millwork, shelving and general repairs for commercial and industrial properties.",
    highlights: ["Millwork and shelving", "Trim and finishing", "General repairs", "Small fit-up work"],
    image: IMG.plans,
    imageAlt: "Contractor reviewing construction drawings with a pencil and tape measure",
    order: 4,
  }),
  svc({
    key: "commercial-plumbing",
    division: "commercial",
    group: "com-trades",
    title: "Plumbing Services",
    summary: "Plumbing for commercial renovations, washrooms and repairs.",
    description:
      "Plumbing for commercial renovations, washrooms and repairs. Permit and licensing requirements are confirmed during planning.",
    highlights: ["Fixture installation and replacement", "Washroom plumbing", "Repairs", "Permit requirements confirmed upfront"],
    image: IMG.bathroomTub,
    imageAlt: "Washroom with a freestanding tub, vessel sink and large window",
    order: 5,
  }),
  svc({
    key: "commercial-electrical",
    division: "commercial",
    group: "com-trades",
    title: "Electrical Services",
    summary: "Lighting and electrical work for commercial spaces.",
    description:
      "Lighting and electrical work for commercial renovations and repairs. Permit and licensing requirements are confirmed during planning.",
    highlights: ["Lighting installation and upgrades", "Electrical for renovations", "Repairs", "Permit requirements confirmed upfront"],
    image: IMG.warehouseAisle,
    imageAlt: "Warehouse aisle with tall storage racking and overhead lighting",
    order: 6,
  }),

  // ---- Commercial: maintenance
  svc({
    key: "facility-maintenance",
    division: "commercial",
    group: "com-maintenance",
    title: "Property & Facility Maintenance",
    summary: "Repairs and building upkeep for commercial and industrial properties.",
    description:
      "Commercial repairs, building upkeep and industrial building repairs and maintenance, on a project basis or as a recurring maintenance arrangement.",
    highlights: ["Commercial building repairs", "Industrial building maintenance", "Recurring maintenance contracts", "One point of contact"],
    image: IMG.toolBelt,
    imageAlt: "Close-up of a tool belt holding a hammer and hand tools",
    order: 1,
  }),
];

/** Service keys that existed before the restructure, removed by scripts/migrate-structure.ts. */
export const RETIRED_SERVICE_KEYS = [
  "basement-development",
  "kitchen-bathroom-renovations",
  "home-improvements-maintenance",
  "office-retail-improvements",
  "facility-industrial-maintenance",
];

export type DefaultProject = {
  title: string;
  category: Division;
  description: string;
  serviceKey?: string;
  image: string;
  imageAlt: string;
  order: number;
};

export const DEFAULT_PROJECTS: DefaultProject[] = [
  {
    title: "Modern kitchen renovation",
    serviceKey: "kitchen-basement-renovations",
    category: "residential",
    description: "Example of a kitchen with new cabinetry, island seating and updated lighting.",
    image: IMG.kitchenPendants,
    imageAlt: "Renovated kitchen with island seating and black pendant lights",
    order: 1,
  },
  {
    title: "Bathroom remodel",
    serviceKey: "bathroom-washroom-renovations",
    category: "residential",
    description: "Example of a bathroom with a glass shower enclosure and double vanity.",
    image: IMG.bathroomGlass,
    imageAlt: "Bathroom with glass shower enclosure and double vanity",
    order: 2,
  },
  {
    title: "Finished basement living space",
    serviceKey: "kitchen-basement-renovations",
    category: "residential",
    description: "Example of a finished lower-level living area with recessed lighting.",
    image: IMG.livingRoom,
    imageAlt: "Finished living room with sofas and recessed lighting",
    order: 3,
  },
  {
    title: "Interior finishing",
    serviceKey: "flooring",
    category: "residential",
    description: "Example of interior finishing with clean trim and doorways.",
    image: IMG.hallwayTrim,
    imageAlt: "Hallway with finished doorway, trim and wood flooring",
    order: 4,
  },
  {
    title: "Contemporary bathroom",
    serviceKey: "bathroom-washroom-renovations",
    category: "residential",
    description: "Example of a bathroom with freestanding tub and vessel sink.",
    image: IMG.bathroomTub,
    imageAlt: "Bathroom with freestanding tub and vessel sink",
    order: 5,
  },
  {
    title: "Office interior improvement",
    serviceKey: "commercial-renovations",
    category: "commercial",
    description: "Example of an office corridor with glass partitions and new finishes.",
    image: IMG.officeCorridor,
    imageAlt: "Office corridor with glass partitions and polished floor",
    order: 6,
  },
  {
    title: "Open-plan commercial space",
    serviceKey: "commercial-renovations",
    category: "commercial",
    description: "Example of an open commercial office with meeting area.",
    image: IMG.officeLoft,
    imageAlt: "Open commercial office with concrete ceiling and meeting table",
    order: 7,
  },
  {
    title: "Retail interior",
    serviceKey: "commercial-flooring",
    category: "commercial",
    description: "Example of a retail space with shelving and display lighting.",
    image: IMG.retailStore,
    imageAlt: "Retail clothing store with wall shelving and pendant lighting",
    order: 8,
  },
  {
    title: "Industrial facility",
    serviceKey: "facility-maintenance",
    category: "commercial",
    description: "Example of a large industrial warehouse facility.",
    image: IMG.warehouse,
    imageAlt: "Industrial warehouse interior with racking and high ceilings",
    order: 9,
  },
];
