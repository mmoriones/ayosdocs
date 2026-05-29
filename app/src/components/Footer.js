'use client';

import Link from 'next/link';

/**
 * Unified application footer.
 * Updated to only include existing pages and sections.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerGroups = [
    {
      title: 'Platform',
      links: [
        { label: 'Guides', href: '/guides' },
        { label: 'Bundles', href: '/bundles' },
        { label: 'Updates', href: '/updates' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/support' },
        { label: 'FAQs', href: '/faqs' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#F8F9FF] pt-10 pb-20 lg:pt-16 lg:pb-24 px-6 rounded-t-[40px] lg:rounded-t-[48px] border-t border-white shadow-[0_-12px_40px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        {/* Top Section: Brand & Slogan */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
          <h2 className="text-[32px] lg:text-[40px] font-black text-[#0038A8] tracking-tight mb-1 lg:mb-2">AyosDocs</h2>
          <p className="text-[15px] lg:text-[17px] font-medium text-slate-500">
            Making government processes simple.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-3 w-full max-w-2xl gap-x-4 lg:gap-x-8 gap-y-10 mb-12 lg:mb-16 px-2 lg:px-4 text-center sm:text-left">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4 lg:gap-6">
              <h3 className="text-[14px] lg:text-[16px] font-bold text-[#1C1C1E]">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3 lg:gap-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-[13px] lg:text-[15px] font-medium text-slate-500 hover:text-[#0038A8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col items-center pt-6 lg:pt-8 border-t border-slate-100 w-full max-w-2xl">
          <div className="text-[13px] lg:text-[15px] font-medium text-slate-400">
            © {currentYear} AyosDocs, Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
