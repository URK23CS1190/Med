import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    default: "MedCare — Care, Pharmacy, and Emergency — Unified",
    template: "%s | MedCare",
  },
  description:
    "Premium digital health platform: consult doctors, order medicines, manage health records, find hospital beds, and access emergency services — all unified in one app.",
  keywords: [
    "healthcare",
    "telemedicine",
    "online doctor",
    "pharmacy",
    "hospital beds",
    "emergency",
    "health records",
    "vaccination",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "MedCare — Care, Pharmacy, and Emergency — Unified",
    description: "Premium digital health platform for all your healthcare needs.",
    siteName: "MedCare",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <ToastContainer />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

