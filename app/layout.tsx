import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinguaBot — AI Translation Assistant",
  description: "Translate text into 15+ languages instantly using AI. Powered by Claude.",
  openGraph: {
    title: "LinguaBot — AI Translation Assistant",
    description: "Translate text into 15+ languages instantly using AI.",
    type: "website",
  },
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
