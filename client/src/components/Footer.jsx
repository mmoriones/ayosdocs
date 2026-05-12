import { Link } from 'react-router-dom';
import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-100 bg-white pb-12">
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-16 pb-8">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* COLUMN 1: BRAND & TAGLINE (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="AyosDocs logo"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-slate-800 leading-none">
                <span className="text-teal-600">Ayos</span>
                <span className="ml-1">Docs</span>
              </h1>
            </div>

            <p className="text-[14px] text-slate-500 max-w-xs font-medium leading-relaxed">
              Simplifying government processes with step-by-step guides and progress tracking.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-5 text-slate-400">
              <a href="#" className="hover:text-teal-600 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors">
                <FaXTwitter size={18} />
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: COMPANY (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[15px] font-bold text-slate-900">Company</h4>
            <div className="flex flex-col gap-3 text-[14px]">
              <Link to="/about" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">About</Link>
              <Link to="/contact" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Contact</Link>
            </div>
          </div>

          {/* COLUMN 3: LEGAL (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-[15px] font-bold text-slate-900">Legal</h4>
            <div className="flex flex-col gap-3 text-[14px]">
              <Link to="/terms" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Terms</Link>
              <Link to="/privacy" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Privacy</Link>
            </div>
          </div>

          {/* COLUMN 4: SUPPORT (Span 3) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-[15px] font-bold text-slate-900">Support</h4>
            <div className="flex flex-col gap-3 text-[14px]">
              <Link to="/faqs" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">FAQs</Link>
              <Link to="/contact" className="text-slate-500 hover:text-teal-600 font-medium transition-colors">Help Center</Link>
            </div>
          </div>

        </div>

        {/* BOTTOM: COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-slate-50">
          <p className="text-[13px] font-bold text-slate-400">
            © {currentYear} AyosDocs. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
