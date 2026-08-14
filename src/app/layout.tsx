import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteConfig } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "@/components/providers/session-provider";
import { MotionProvider } from "@/components/providers/motion-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = getSiteConfig();

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s | ${config.name}`,
  },
  description: config.description,
  metadataBase: new URL(config.url),
  alternates: {
    canonical: config.url,
  },
  keywords: [
    "Ishfaq Dar",
    "Full Stack Developer",
    "Web Developer",
    "UI/UX Designer",
    "Data Analyst",
    "Data Scientist",
    "Backend Engineer",
    "Kashmir Developer",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.url,
    title: config.name,
    description: config.description,
    siteName: config.name,
    images: [
      {
        url: config.ogImage,
        width: 1200,
        height: 630,
        alt: config.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.name,
    description: config.description,
    images: [config.ogImage],
    creator: config.links.twitter?.split("/").pop(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <MotionProvider>
          <SessionProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SessionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
