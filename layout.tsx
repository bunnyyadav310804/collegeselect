import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Discovery",
  description: "Search and compare colleges with data-driven insights."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
