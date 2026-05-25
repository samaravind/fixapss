import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import SiteFooter from "./site-footer";

export const metadata: Metadata = {
  title: "Fixx Market | Deals, categories and fast shopping",
  description: "A Flipkart-inspired marketplace storefront built for browsing deals, categories and quick shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f1f3f6]">
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
