import Link from 'next/link';
import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-ctp-surface0 bg-ctp-mantle pb-12">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* COLUMN 1: BRAND & TAGLINE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src="/favicon.svg"
                alt="AyosDocs logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold text-ctp-text leading-none">
                <span className="text-ctp-sky-800">Ayos</span>
                <span className="ml-1">Docs</span>
              </h1>
            </div>

            <p className="text-sm text-ctp-subtext1 max-w-xs font-medium leading-relaxed">
              Simplifying government processes with step-by-step guides and progress tracking.
            </p>

            <div className="flex items-center gap-6 text-ctp-subtext0">
              <a href="#" className="hover:text-ctp-sky-800 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-ctp-sky-800 transition-colors">
                <FaXTwitter size={20} />
              </a>
              <a href="#" className="hover:text-ctp-sky-800 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-ctp-sky-800 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: COMPANY */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-bold text-ctp-text">Company</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/about" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">About</Link>
              <Link href="/contact" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">Contact</Link>
            </div>
          </div>

          {/* COLUMN 3: LEGAL */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-bold text-ctp-text">Legal</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/terms" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">Terms</Link>
              <Link href="/privacy" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">Privacy</Link>
            </div>
          </div>

          {/* COLUMN 4: SUPPORT */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-lg font-bold text-ctp-text">Support</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/faqs" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">FAQs</Link>
              <Link href="/contact" className="text-ctp-subtext1 hover:text-ctp-sky-800 font-medium transition-colors">Help Center</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ctp-surface0">
          <p className="text-sm font-bold text-ctp-subtext0">
            © {currentYear} AyosDocs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
