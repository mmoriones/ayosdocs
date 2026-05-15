import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/features/navigation/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/features/auth/components/AuthModal";
import MobileMenu from "@/features/navigation/components/MobileMenu";
import ClientAuthWrapper from "@/components/ClientAuthWrapper";

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
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ctp-base text-ctp-text transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ClientAuthWrapper />
        </Providers>
      </body>
    </html>
  );
}
