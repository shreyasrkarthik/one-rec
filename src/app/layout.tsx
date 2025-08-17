import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneRec - One Perfect Recommendation",
  description: "Get opinionated, single recommendations for activities and places based on your mood and location.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
