import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarLayout from "@/components/SidebarLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Microsoft Partner Sales Intelligence",
  description: "AI-powered sales intelligence platform for Microsoft Partner Account Managers — Account Intel, Email Generator, Sequences & Knowledge Base.",
  keywords: ["Microsoft", "sales intelligence", "account manager", "copilot", "AI", "B2B", "Partner Account Manager"],
  authors: [{ name: "Nicolas BAYONNE" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SidebarLayout>
            {children}
          </SidebarLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
