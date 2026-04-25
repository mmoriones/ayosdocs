import { Link } from 'react-router-dom';
import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* BRAND */}
          <div className="max-w-sm space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              AyosDocs
            </h3>
            <p className="text-sm text-gray-500">
              Simplifying government processes with step-by-step guides and progress tracking.
            </p>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">

            <div className="space-y-2">
              <p className="font-medium text-gray-700">Company</p>
              <Link to="/about" className="block text-gray-500 hover:text-teal-600">About</Link>
              <Link to="/contact" className="block text-gray-500 hover:text-teal-600">Contact</Link>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-700">Legal</p>
              <Link to="/terms" className="block text-gray-500 hover:text-teal-600">Terms</Link>
              <Link to="/privacy-policy" className="block text-gray-500 hover:text-teal-600">Privacy</Link>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-700">Support</p>
              <Link to="/faqs" className="block text-gray-500 hover:text-teal-600">FAQs</Link>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gray-100" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* COPYRIGHT */}
          <p className="text-sm text-gray-500">
            © {currentYear} AyosDocs. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-teal-600 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-teal-600 transition">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-teal-600 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-teal-600 transition">
              <FaYoutube />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
