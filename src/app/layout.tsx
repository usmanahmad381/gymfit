import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymFit — Train Hard. Live Strong.",
  description:
    "GymFit is a modern fitness club with expert coaches, 24/7 access, and classes for every level. Start your transformation today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
