"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, Image as ImageIcon, Images, Inbox, LayoutDashboard, LogOut, Menu, Settings, Wrench, X } from "lucide-react";
import { logout } from "@/app/admin/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: Images },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ name, newCount, children }: { name: string; newCount: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-sm font-bold tracking-wide">Handyman 4 Calgary</p>
        <p className="mt-0.5 text-xs text-white/60">Website admin</p>
      </div>
      <ul className="flex-1 space-y-0.5 p-3">
        {NAV.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-[3px] px-3 text-sm transition-colors ${
                active(href) ? "bg-white font-semibold text-ink" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {href === "/admin/enquiries" && newCount > 0 && (
                <span className={`rounded-[2px] px-1.5 text-[11px] font-bold ${active(href) ? "bg-ink text-white" : "bg-white text-ink"}`}>
                  {newCount} new
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener" className="flex min-h-11 items-center gap-3 rounded-[3px] px-3 text-sm text-white/80 hover:bg-white/10">
          <ExternalLink aria-hidden="true" className="h-4 w-4" /> View website
        </a>
        <form action={logout}>
          <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-[3px] px-3 text-sm text-white/80 hover:bg-white/10">
            <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
          </button>
        </form>
        <p className="truncate px-3 pt-2 text-xs text-white/50">Signed in as {name}</p>
      </div>
    </nav>
  );

  return (
    <div className="lg:flex">
      <aside className="on-dark sticky top-0 hidden h-dvh w-64 shrink-0 bg-charcoal text-white lg:block">{nav}</aside>

      <div className="on-dark sticky top-0 z-30 flex h-14 items-center justify-between bg-charcoal px-4 text-white lg:hidden">
        <p className="text-sm font-bold">H4C Admin</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="on-dark absolute inset-y-0 left-0 w-72 bg-charcoal text-white">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close admin menu" className="absolute right-2 top-3 inline-flex h-11 w-11 items-center justify-center">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}

export function AdminHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
