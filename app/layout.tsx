import type { Metadata } from "next";
import "./globals.css";
import { AppSessionProvider } from "@/components/session-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "HopnStay",
  description: "Search and compare hotel deals from trusted travel partners."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppSessionProvider>
          <SiteHeader />
          <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </AppSessionProvider>
      </body>
    </html>
  );
}
