import { PublicHeader, BottomNav } from '@/components/layout';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/Footer';

/**
 * Shared layout for all public-facing informational pages.
 * Provides a consistent header, background, and footer.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col selection:bg-[#0038A8]/10">
      <div className="hidden lg:block">
        <PublicHeader />
      </div>
      <MobileHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
