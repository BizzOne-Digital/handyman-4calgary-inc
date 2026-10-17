"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { MAIN_NAV, isActive } from "./nav";

type Props = { logoUrl: string; logoAlt: string; phone: string; phoneHref: string; email: string };

export function Header({ logoUrl, logoAlt, phone, phoneHref, email }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>("a,button")];
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Desktop dropdown: close on outside click or Escape.
  useEffect(() => {
    if (!dropdown) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdown(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDropdown(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdown]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[96px] lg:px-10">
        <Logo src={logoUrl} alt={logoAlt} priority className="h-14 lg:h-[84px]" />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              const linkCls = `relative inline-flex h-11 items-center px-2.5 text-[14px] transition-colors ${
                active ? "font-semibold text-ink" : "text-muted hover:text-ink"
              }`;
              const underline = active && (
                <span aria-hidden="true" className="absolute inset-x-2.5 bottom-1.5 h-[2px] bg-ink" />
              );
              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={linkCls}>
                      {item.label}
                      {underline}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={item.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >
                  <div className="flex items-center">
                    <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`${linkCls} pr-1`}>
                      {item.label}
                      {underline}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={dropdown}
                      aria-controls="residential-menu"
                      aria-label="Show residential services"
                      onClick={() => setDropdown((d) => !d)}
                      className="inline-flex h-11 w-7 items-center justify-center text-muted hover:text-ink"
                    >
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${dropdown ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  <div
                    id="residential-menu"
                    hidden={!dropdown}
                    className="absolute left-0 top-full w-[300px] pt-2"
                  >
                    <ul className="rounded-[4px] border border-line bg-white p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            aria-current={pathname === c.href ? "page" : undefined}
                            className={`block rounded-[3px] px-3 py-2.5 text-sm transition-colors hover:bg-mist ${
                              pathname === c.href ? "font-semibold text-ink" : "text-muted hover:text-ink"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/request-a-quote"
            className="group hidden min-h-11 items-center gap-2.5 rounded-[3px] bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-graphite sm:inline-flex"
          >
            Request a Quote
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="px-4 pb-10 pt-4 sm:px-6">
            <ul className="divide-y divide-line">
              {MAIN_NAV.map((item) => (
                <li key={item.href} className="py-1">
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`flex min-h-12 items-center text-lg ${isActive(pathname, item.href) ? "font-semibold" : "text-graphite"}`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-2 ml-1 border-l border-line pl-4">
                      {item.children.slice(1).map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            aria-current={pathname === c.href ? "page" : undefined}
                            className={`flex min-h-11 items-center text-[15px] ${pathname === c.href ? "font-semibold text-ink" : "text-muted"}`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/request-a-quote"
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-ink text-sm font-semibold text-white"
            >
              Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <div className="mt-6 space-y-3 text-sm">
              <a href={phoneHref} className="flex min-h-11 items-center gap-3 font-semibold">
                <Phone aria-hidden="true" className="h-4 w-4" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex min-h-11 items-center gap-3 text-muted">
                <Mail aria-hidden="true" className="h-4 w-4" /> {email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
