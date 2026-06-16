import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "BharatMart — India Ka Apna Marketplace",
    template: "%s | BharatMart",
  },
  description:
    "India's largest multi-vendor marketplace — shop products, book home services, and hire top freelancers. INR pricing, Razorpay payments, fast delivery across India.",
  keywords: [
    "India marketplace",
    "online shopping India",
    "home services",
    "freelancers India",
    "BharatMart",
    "INR shopping",
    "Razorpay",
  ],
  authors: [{ name: "BharatMart" }],
  creator: "BharatMart",
  publisher: "BharatMart Technologies Pvt. Ltd.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bharatmart.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "BharatMart — India Ka Apna Marketplace",
    description:
      "Shop products, book home services, hire freelancers — all on India's premium marketplace.",
    siteName: "BharatMart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BharatMart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BharatMart — India Ka Apna Marketplace",
    description: "Shop, book services & hire freelancers on India's premium marketplace.",
    images: ["/og-image.png"],
    creator: "@bharatmart",
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReduxProvider>
            <QueryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontFamily: "var(--font-inter)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "white",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "white",
                    },
                  },
                }}
              />
            </QueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
