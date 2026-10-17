export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Residential",
    href: "/residential",
    children: [
      { label: "Residential Overview", href: "/residential" },
      { label: "Basement Development", href: "/residential/basement-development" },
      { label: "Kitchen & Bathroom Renovations", href: "/residential/kitchen-bathroom-renovations" },
      { label: "Home Improvements & Maintenance", href: "/residential/home-improvements-maintenance" },
    ],
  },
  { label: "Commercial & Industrial", href: "/commercial-industrial" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
