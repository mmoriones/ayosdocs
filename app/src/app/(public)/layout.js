import { PublicHeader } from '@/components/layout';
import Footer from '@/components/Footer';

/**
 * Shared layout for all public-facing informational pages and the login experience.
 * Provides a consistent header, background, and footer.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-ctp-mantle flex flex-col selection:bg-ctp-sky-800/20">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
