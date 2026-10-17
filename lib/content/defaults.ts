import type { PageSlug } from "@/lib/constants";
import type { PageData } from "@/models/PageContent";
import type { SiteSettingsData } from "@/models/SiteSettings";
import type { Division } from "@/lib/constants";
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
      "Basement development, kitchen and bathroom renovations, home improvements and property maintenance for Calgary homeowners and landlords.",
    hero: {
      eyebrow: "Residential / Home Services",
      heading: "Renovations and improvements for your home.",
      description:
        "Basement development, kitchen and bathroom renovations, and ongoing home improvements for Calgary homeowners, landlords and residential property owners.",
      ctaLabel: "Request a Residential Quote",
      ctaHref: "/request-a-quote?division=residential",
      image: IMG.openPlan,
      imageAlt: "Open-plan modern living room with large windows and wood accent wall",
    },
    intro: {
      heading: "Built for homeowners, landlords and residential property owners.",
      body: "We focus on medium-to-large residential projects: finishing a basement, renovating a kitchen or bathroom, or bringing a property back to a good standard between tenants. Every project starts with a clear conversation about scope, priorities and the next practical step.",
    },
    faqs: [
      quoteFaq,
      {
        question: "Do you take on small one-off repairs?",
        answer:
          "Our focus is renovation projects and ongoing maintenance. We are happy to discuss smaller items as part of a larger project or a maintenance arrangement for your property.",
      },
      {
        question: "Can you help landlords and rental property owners?",
        answer:
          "Yes. We work with landlords and residential property owners on renovations between tenancies, general repairs and ongoing property maintenance.",
      },
      {
        question: "What areas do you serve?",
        answer: "We serve Calgary, Alberta. If your property is nearby, contact us and we will confirm whether we can help.",
      },
    ],
  }),

  "basement-development": page({
    seoTitle: "Basement Development & Renovations in Calgary",
    seoDescription:
      "Basement finishing and renovation in Calgary: framing, drywall, layout improvements and interior finishing for usable, comfortable living space.",
    hero: {
      eyebrow: "Residential / Basement Development",
      heading: "Basement development and renovations.",
      description:
        "Turn an unfinished or dated basement into practical, comfortable living space, planned around how your household actually uses it.",
      ctaLabel: "Request a Basement Quote",
      ctaHref: "/request-a-quote?division=residential&service=basement-development",
      image: IMG.livingRoomBright,
      imageAlt: "Bright finished living space with neutral sofas, plants and natural light",
    },
    intro: {
      heading: "From open concrete to finished living space.",
      body: "Whether you are finishing a basement for the first time or renovating an older one, we plan the layout, build the structure and complete the interior finishing. We discuss permits, scope and sequencing at the start so the project runs in a clear order.",
    },
    media: [
      {
        key: "overview",
        label: "Overview image",
        url: IMG.livingRoom,
        alt: "Finished lower-level living room with sofas, recessed lighting and large windows",
      },
      {
        key: "finishing",
        label: "Finishing image",
        url: IMG.loungeCorner,
        alt: "Finished room corner with white walls, wood flooring and a yellow armchair",
      },
    ],
    faqs: [
      {
        question: "Do basement developments need a permit in Calgary?",
        answer:
          "Most basement developments in Calgary require permits. We discuss permit requirements during planning so they are accounted for before work begins.",
      },
      {
        question: "How long does a basement development take?",
        answer:
          "It depends on the size, layout and finishes. We provide an expected timeline with your quote once we understand the scope.",
      },
      {
        question: "Can you renovate a basement that is already finished?",
        answer:
          "Yes. We can update layouts, replace drywall and finishes, and improve an existing basement as well as finishing new space.",
      },
      quoteFaq,
    ],
  }),

  "kitchen-bathroom-renovations": page({
    seoTitle: "Kitchen & Bathroom Renovations in Calgary",
    seoDescription:
      "Kitchen and bathroom renovations in Calgary: cabinet installation, finishing, fixture-related improvements and remodeling within confirmed scope.",
    hero: {
      eyebrow: "Residential / Kitchen & Bathroom",
      heading: "Kitchen and bathroom renovations.",
      description:
        "Practical remodeling for the two rooms that matter most in day-to-day living, planned and finished with care.",
      ctaLabel: "Request a Renovation Quote",
      ctaHref: "/request-a-quote?division=residential&service=kitchen-renovation",
      image: IMG.kitchenWhite,
      imageAlt: "White kitchen with island, pendant lights and stainless steel range",
    },
    intro: {
      heading: "Renovations planned around how you use the space.",
      body: "We help you decide what to keep, what to change and how to sequence the work. Where a project needs licensed plumbing or electrical work, we discuss that openly during planning.",
    },
    media: [
      {
        key: "kitchen",
        label: "Kitchen section image",
        url: IMG.kitchenCounter,
        alt: "Modern kitchen with white upper cabinets and stone countertop",
      },
      {
        key: "bathroom",
        label: "Bathroom section image",
        url: IMG.bathroomGlass,
        alt: "Renovated bathroom with glass shower enclosure and double vanity",
      },
      {
        key: "bathroom-alt",
        label: "Second bathroom image",
        url: IMG.bathroomTub,
        alt: "Bright bathroom with freestanding tub and vessel sink",
      },
    ],
    faqs: [
      {
        question: "Can I stay in my home during a kitchen or bathroom renovation?",
        answer:
          "In most cases, yes. We will talk through the work sequence so you know which rooms are affected and when.",
      },
      {
        question: "Do you install cabinets I have already purchased?",
        answer: "Yes. Let us know the details in your request and we will confirm what is involved.",
      },
      {
        question: "Do you handle plumbing for bathroom renovations?",
        answer:
          "We discuss plumbing scope during planning and confirm what is included in your quote. Any regulated work is handled within the applicable permit and licensing requirements.",
      },
      quoteFaq,
    ],
  }),

  "home-improvements-maintenance": page({
    seoTitle: "Home Improvements & Property Maintenance in Calgary",
    seoDescription:
      "Interior and exterior painting, drywall, framing, carpentry, doors, trim and ongoing residential property maintenance across Calgary.",
    hero: {
      eyebrow: "Residential / Home Improvements",
      heading: "Home improvements and property maintenance.",
      description:
        "Painting, drywall, carpentry and general repairs, plus ongoing maintenance for homeowners and residential property owners.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote?division=residential&service=home-improvements",
      image: IMG.houseExterior,
      imageAlt: "Two-storey residential house with porch surrounded by autumn trees",
    },
    intro: {
      heading: "Keep your property in good condition.",
      body: "We take on improvement projects across the home and offer ongoing maintenance for owners who want one reliable contact for their property.",
    },
    media: [
      {
        key: "painting",
        label: "Painting image",
        url: IMG.paintRoller,
        alt: "Paint roller applying light blue paint to a white wall",
      },
      {
        key: "carpentry",
        label: "Carpentry, doors & trim image",
        url: IMG.hallwayTrim,
        alt: "Bright hallway with finished doorway, trim and wood flooring",
      },
      {
        key: "maintenance",
        label: "Maintenance image",
        url: IMG.toolBelt,
        alt: "Close-up of a tool belt holding hand tools",
      },
    ],
    faqs: [
      {
        question: "Do you offer ongoing maintenance for rental properties?",
        answer:
          "Yes. Tell us about the property and the type of upkeep you need, and we will discuss a practical maintenance arrangement.",
      },
      {
        question: "Can you combine several improvements into one project?",
        answer:
          "Yes. Combining painting, drywall repairs and carpentry into one planned project is often the most efficient approach.",
      },
      quoteFaq,
    ],
  }),

  "commercial-industrial": page({
    seoTitle: "Commercial & Industrial Contracting in Calgary",
    seoDescription:
      "Commercial renovations, tenant improvements, office and retail upgrades, and industrial building repairs and maintenance across Calgary.",
    hero: {
      eyebrow: "Commercial & Industrial",
      heading: "Projects and maintenance for your business.",
      description:
        "Commercial renovations, office and retail improvements, and facility and industrial building maintenance for Calgary businesses and property managers.",
      ctaLabel: "Request a Commercial Quote",
      ctaHref: "/request-a-quote?division=commercial",
      image: IMG.officeLoft,
      imageAlt: "Open commercial office space with concrete ceiling, meeting table and large windows",
    },
    intro: {
      heading: "Two kinds of work, one accountable contractor.",
      body: "Commercial improvement projects change how a space looks and works. Industrial building maintenance keeps a facility safe, functional and in good repair. We handle both on a project basis or through ongoing maintenance arrangements.",
    },
    media: [
      {
        key: "industrial",
        label: "Industrial maintenance image",
        url: IMG.warehouseAisle,
        alt: "Tall warehouse racking aisle in an industrial facility",
      },
      {
        key: "process",
        label: "Process image",
        url: IMG.plans,
        alt: "Contractor reviewing construction drawings on a table",
      },
    ],
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
  "basement-development",
  "kitchen-bathroom-renovations",
  "home-improvements-maintenance",
  "commercial-industrial",
  "about",
];

export type DefaultService = {
  key: string;
  division: Division;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  href: string;
  image: string;
  imageAlt: string;
  order: number;
};

export const DEFAULT_SERVICES: DefaultService[] = [
  {
    key: "basement-development",
    division: "residential",
    title: "Basement Development",
    summary: "Finish or renovate your basement into practical, comfortable living space.",
    description:
      "Planning, framing, drywall, layout improvements and interior finishing for new and existing basements.",
    highlights: ["Layout planning", "Framing and drywall", "Interior finishing", "Renovation of existing basements"],
    href: "/residential/basement-development",
    image: IMG.livingRoom,
    imageAlt: "Finished basement living room with sofas and recessed lighting",
    order: 1,
  },
  {
    key: "kitchen-bathroom-renovations",
    division: "residential",
    title: "Kitchen & Bathroom Renovations",
    summary: "Remodeling, cabinet installation and finishing for kitchens and bathrooms.",
    description:
      "Kitchen and bathroom remodeling, cabinet installation, finishing and fixture-related improvements within confirmed scope.",
    highlights: ["Cabinet installation", "Remodeling and finishing", "Fixture-related improvements", "Layout updates"],
    href: "/residential/kitchen-bathroom-renovations",
    image: IMG.bathroomGlass,
    imageAlt: "Renovated bathroom with glass shower and double vanity",
    order: 2,
  },
  {
    key: "home-improvements-maintenance",
    division: "residential",
    title: "Home Improvements & Maintenance",
    summary: "Painting, drywall, carpentry, repairs and ongoing property maintenance.",
    description:
      "Interior and exterior painting, drywall and framing, carpentry, doors and trim, general repairs and ongoing residential maintenance.",
    highlights: ["Interior and exterior painting", "Drywall and framing", "Carpentry, doors and trim", "Ongoing maintenance"],
    href: "/residential/home-improvements-maintenance",
    image: IMG.houseExterior,
    imageAlt: "Residential house with porch and autumn trees",
    order: 3,
  },
  {
    key: "commercial-renovations",
    division: "commercial",
    title: "Commercial Renovations",
    summary: "Renovations and tenant improvements for commercial spaces.",
    description:
      "Interior renovations and tenant improvements that prepare commercial spaces for new occupants or new ways of working, including drywall, framing, painting and carpentry.",
    highlights: ["Tenant improvements", "Interior renovations", "Drywall, framing and painting", "Carpentry and finishing"],
    href: "/commercial-industrial#commercial-renovations",
    image: IMG.officeCorridor,
    imageAlt: "Commercial office corridor with glass partitions and polished floor",
    order: 1,
  },
  {
    key: "office-retail-improvements",
    division: "commercial",
    title: "Office & Retail Improvements",
    summary: "Upgrades that help offices and retail spaces work better.",
    description:
      "Office and retail improvements such as partition walls, finishes, repainting, millwork and layout updates, planned around your operations.",
    highlights: ["Office layout updates", "Retail fit-up improvements", "Repainting and finishes", "Trim and millwork"],
    href: "/commercial-industrial#office-retail",
    image: IMG.officeLounge,
    imageAlt: "Bright office lounge area with modern chairs and timber shelving",
    order: 2,
  },
  {
    key: "facility-industrial-maintenance",
    division: "commercial",
    title: "Facility & Industrial Maintenance",
    summary: "Building repairs and upkeep for commercial and industrial facilities.",
    description:
      "Commercial repairs, building upkeep, and industrial building repairs and maintenance within confirmed scope, on a project basis or as ongoing maintenance.",
    highlights: ["Commercial repairs", "Building upkeep", "Industrial building repairs", "Ongoing maintenance contracts"],
    href: "/commercial-industrial#facility-maintenance",
    image: IMG.warehouseAisle,
    imageAlt: "Industrial warehouse aisle with tall storage racking",
    order: 3,
  },
];

export type DefaultProject = {
  title: string;
  category: Division;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
};

export const DEFAULT_PROJECTS: DefaultProject[] = [
  {
    title: "Modern kitchen renovation",
    category: "residential",
    description: "Example of a kitchen with new cabinetry, island seating and updated lighting.",
    image: IMG.kitchenPendants,
    imageAlt: "Renovated kitchen with island seating and black pendant lights",
    order: 1,
  },
  {
    title: "Bathroom remodel",
    category: "residential",
    description: "Example of a bathroom with a glass shower enclosure and double vanity.",
    image: IMG.bathroomGlass,
    imageAlt: "Bathroom with glass shower enclosure and double vanity",
    order: 2,
  },
  {
    title: "Finished basement living space",
    category: "residential",
    description: "Example of a finished lower-level living area with recessed lighting.",
    image: IMG.livingRoom,
    imageAlt: "Finished living room with sofas and recessed lighting",
    order: 3,
  },
  {
    title: "Interior finishing",
    category: "residential",
    description: "Example of interior finishing with clean trim and doorways.",
    image: IMG.hallwayTrim,
    imageAlt: "Hallway with finished doorway, trim and wood flooring",
    order: 4,
  },
  {
    title: "Contemporary bathroom",
    category: "residential",
    description: "Example of a bathroom with freestanding tub and vessel sink.",
    image: IMG.bathroomTub,
    imageAlt: "Bathroom with freestanding tub and vessel sink",
    order: 5,
  },
  {
    title: "Office interior improvement",
    category: "commercial",
    description: "Example of an office corridor with glass partitions and new finishes.",
    image: IMG.officeCorridor,
    imageAlt: "Office corridor with glass partitions and polished floor",
    order: 6,
  },
  {
    title: "Open-plan commercial space",
    category: "commercial",
    description: "Example of an open commercial office with meeting area.",
    image: IMG.officeLoft,
    imageAlt: "Open commercial office with concrete ceiling and meeting table",
    order: 7,
  },
  {
    title: "Retail interior",
    category: "commercial",
    description: "Example of a retail space with shelving and display lighting.",
    image: IMG.retailStore,
    imageAlt: "Retail clothing store with wall shelving and pendant lighting",
    order: 8,
  },
  {
    title: "Industrial facility",
    category: "commercial",
    description: "Example of a large industrial warehouse facility.",
    image: IMG.warehouse,
    imageAlt: "Industrial warehouse interior with racking and high ceilings",
    order: 9,
  },
];
