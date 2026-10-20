import { SERVICE_GROUPS } from "@/lib/constants";

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const groupLinks = (division: "residential" | "commercial") =>
  SERVICE_GROUPS.filter((g) => g.division === division).map((g) => ({ label: g.title, href: g.path }));

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Residential",
    href: "/residential",
    children: [{ label: "All Residential Services", href: "/residential" }, ...groupLinks("residential")],
  },
  {
    label: "Commercial & Industrial",
    href: "/commercial-industrial",
    children: [{ label: "All Commercial & Industrial Services", href: "/commercial-industrial" }, ...groupLinks("commercial")],
  },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
