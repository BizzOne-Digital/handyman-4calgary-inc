import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Handyman 4 Calgary",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-mist">{children}</div>;
}
