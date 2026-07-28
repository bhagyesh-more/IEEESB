import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MMIT IEEE Student Branch | Enterprise Digital Platform",
  description: "Official digital platform of MMIT IEEE Student Branch featuring events, member directory, achievements, gallery, and dynamic CMS.",
  keywords: ["MMIT", "IEEE", "Student Branch", "Engineering", "Technology", "Events", "Pune"],
  authors: [{ name: "MMIT IEEE Student Branch Technical Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col bg-slate-950 text-slate-100`}>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="mmit-ieee-theme">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
