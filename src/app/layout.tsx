import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/utlis/theme";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  getDefaultMetadata,
  getBaseUrl,
  getSiteName,
  getSiteDescription,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const base = getDefaultMetadata();
const baseUrl = getBaseUrl();
const siteName = getSiteName();
const siteDescription = getSiteDescription();

export const metadata: Metadata = {
  metadataBase: base.metadataBase,
  title: base.title,
  description: siteDescription,
  keywords: [
    "investment",
    "investment platform",
    "deposits",
    "withdrawals",
    "returns",
    "portfolio",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: base.title.default,
    description: siteDescription,
    ...(baseUrl && { url: baseUrl }),
  },
  twitter: {
    card: "summary_large_image",
    title: base.title.default,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
