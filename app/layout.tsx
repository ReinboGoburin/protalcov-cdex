import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alcove - Prototype",
  description: "Prototype de curation culturelle personnelle"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
