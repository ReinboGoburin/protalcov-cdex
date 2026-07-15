import type { Metadata } from "next";
import { plexSans, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alcove — Prototype",
  description: "Alcove — curation culturelle personnelle (prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
