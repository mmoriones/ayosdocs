'use client';

import Link from 'next/link';

/**
 * Unified application footer.
 * Features a minimalistic single-row layout with vertical dividers.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Support', href: '/support' },
    { label: 'About', href: '/about' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <footer className="w-full border-t border-ctp-surface1 bg-transparent px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-ui-label text-ctp-subtext1">
        {links.map((link, index) => (
          <div key={link.label} className="flex items-center gap-4">
            <Link 
              href={link.href} 
              target="_blank"
              rel="noopener noreferrer"
              className="active:scale-[0.97] transition-all hover:text-ctp-sky-800 font-medium"
            >
              {link.label}
            </Link>
            {index < links.length - 1 && (
              <div className="h-4 w-px bg-ctp-surface1" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4">
          <div className="h-4 w-px bg-ctp-surface1" />
          <div className="font-medium whitespace-nowrap">
            © {currentYear} AyosDocs, Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
