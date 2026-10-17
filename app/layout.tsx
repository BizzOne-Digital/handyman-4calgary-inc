import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Inter_Tight({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Handyman 4 Calgary", template: "%s" },
};

export const viewport: Viewport = { themeColor: "#111112", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${body.variable} ${heading.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Toaster position="top-center" closeButton toastOptions={{ classNames: { toast: "!rounded-[4px] !font-sans" } }} />
      </body>
    </html>
  );
}
