/** AI-generated illustrative images; these do not depict completed client projects. */
export const IMG = {
  "kitchenPendants": "/images/kitchen-pendants.webp",
  "kitchenWhite": "/images/kitchen-white.webp",
  "kitchenCounter": "/images/kitchen-counter.webp",
  "warehouse": "/images/warehouse.webp",
  "warehouseAisle": "/images/warehouse-aisle.webp",
  "officeLoft": "/images/office-loft.webp",
  "officeCorridor": "/images/office-corridor.webp",
  "officeLounge": "/images/office-lounge.webp",
  "retailStore": "/images/retail-store.webp",
  "livingRoom": "/images/living-room.webp",
  "livingRoomBright": "/images/living-room-bright.webp",
  "loungeCorner": "/images/lounge-corner.webp",
  "openPlan": "/images/open-plan.webp",
  "bathroomGlass": "/images/bathroom-glass.webp",
  "bathroomTub": "/images/bathroom-tub.webp",
  "houseExterior": "/images/house-exterior.webp",
  "paintRoller": "/images/paint-roller.webp",
  "hallwayTrim": "/images/hallway-trim.webp",
  "carpenter": "/images/carpenter.webp",
  "toolBelt": "/images/tool-belt.webp",
  "plans": "/images/plans.webp"
} as const;

/** Exact original stock-photo paths, including content already seeded in MongoDB. */
const LEGACY_IMAGES: Record<string, string> = {
  "/photo-1484154218962-a197022b5858": "/images/kitchen-pendants.webp",
  "/photo-1507089947368-19c1da9775ae": "/images/kitchen-white.webp",
  "/photo-1556911220-bff31c812dba": "/images/kitchen-counter.webp",
  "/photo-1586528116311-ad8dd3c8310d": "/images/warehouse.webp",
  "/photo-1553413077-190dd305871c": "/images/warehouse-aisle.webp",
  "/photo-1581091226825-a6a2a5aee158": "/images/warehouse.webp",
  "/photo-1497366811353-6870744d04b2": "/images/office-loft.webp",
  "/photo-1497366216548-37526070297c": "/images/office-corridor.webp",
  "/photo-1524758631624-e2822e304c36": "/images/office-lounge.webp",
  "/photo-1441986300917-64674bd600d8": "/images/retail-store.webp",
  "/photo-1560448204-e02f11c3d0e2": "/images/living-room.webp",
  "/photo-1600210492486-724fe5c67fb0": "/images/living-room-bright.webp",
  "/photo-1586023492125-27b2c045efd7": "/images/lounge-corner.webp",
  "/photo-1600607687939-ce8a6c25118c": "/images/open-plan.webp",
  "/photo-1584622650111-993a426fbf0a": "/images/bathroom-glass.webp",
  "/photo-1600566752355-35792bedcfea": "/images/bathroom-glass.webp",
  "/photo-1620626011761-996317b8d101": "/images/bathroom-tub.webp",
  "/photo-1572120360610-d971b9d7767c": "/images/house-exterior.webp",
  "/photo-1562259949-e8e7689d7828": "/images/paint-roller.webp",
  "/photo-1581858726788-75bc0f6a952d": "/images/hallway-trim.webp",
  "/photo-1589939705384-5185137a7f0f": "/images/carpenter.webp",
  "/photo-1595844730298-b960ff98fee0": "/images/tool-belt.webp",
  "/photo-1503387762-592deb58ef4e": "/images/plans.webp",
  "/photo-1504307651254-35680f356dfd": "/images/carpenter.webp"
};

/** Preserve admin uploads and custom images; remap only the original selected stock photos. */
export function resolveImageUrl(value?: string | null): string {
  if (!value || !value.startsWith("https://images.unsplash.com/")) return value || "";
  try {
    const url = new URL(value);
    if (url.hostname !== "images.unsplash.com") return value;
    return LEGACY_IMAGES[url.pathname] || value;
  } catch {
    return value;
  }
}

/** Real Handyman 4 Calgary project photos supplied by the client (public/images/projects). */
const p = (name: string) => `/images/projects/${name}.webp`;
export const PHOTO = {
  stairLanding: p("stair-landing-handrail"),
  woodFraming: p("wood-framing-renovation"),
  kitchenRange: p("kitchen-range-tile-backsplash"),
  glassShowerDoor: p("bathroom-glass-shower-door"),
  commercialFraming: p("commercial-steel-stud-framing"),
  interiorDoor: p("interior-door-black-hardware"),
  bathroomShower: p("bathroom-shower-vanity"),
  basementSuite: p("basement-suite-living-kitchen"),
  showerGrabBar: p("glass-shower-grab-bar"),
  showerTile: p("shower-tile-detail"),
  kitchenMicrowave: p("kitchen-range-microwave"),
  stairwellGlass: p("stairwell-glass-railing"),
  vanityFaucet: p("vanity-brass-faucet"),
  doubleVanity: p("double-vanity-sink"),
  bathroomTub: p("bathroom-tub-double-vanity"),
  stairTreads: p("stair-treads"),
  vanityCabinet: p("vanity-cabinet"),
  openToBelow: p("open-to-below-iron-railing"),
  carpetedStairs: p("carpeted-stairs-railing"),
  bonusRoom: p("bonus-room-glass-railing"),
} as const;
