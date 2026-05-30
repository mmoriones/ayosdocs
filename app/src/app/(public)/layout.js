import { PublicHeader } from '@/components/layout';
import Footer from '@/components/Footer';

/**
 * Shared layout for all public-facing informational pages and the login experience.
 * Provides a consistent header, background, and footer.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-ios-gradient flex flex-col selection:bg-[#0038A8]/10">
      <div className="hidden lg:block">
        <PublicHeader />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
