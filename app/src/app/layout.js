import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/context";
import ChatAssistant from "@/components/chat/ChatAssistant";
import SerwistProviderWrapper from "@/components/SerwistProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AyosDocs - Government Guide Platform",
  description: "Your guide to Philippine government processes.",
  applicationName: "AyosDocs",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AyosDocs",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0038A8",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col text-ctp-text antialiased">
        <ThemeProvider>
          <SerwistProviderWrapper>
            <Providers session={session}>
              {children}
            </Providers>
          </SerwistProviderWrapper>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
