'use client';

import Footer from '@/components/Footer';

/**
 * Specialized layout for authentication pages (Login, Signup, Reset Password).
 * Provides a clean, full-screen experience without a top header.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col selection:bg-[#0038A8]/10">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
