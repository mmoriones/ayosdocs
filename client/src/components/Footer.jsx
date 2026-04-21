import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-8 mt-12 border-t transition-colors duration-300
      bg-white border-gray-200 text-gray-500 
      dark:bg-[#1a1c1e] dark:border-gray-800 dark:text-gray-400">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
          <Link to="/about" className="text-[11px] font-bold uppercase hover:text-teal-600 dark:hover:text-white transition-colors">
            About Us
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/contact" className="text-[11px] font-bold uppercase hover:text-teal-600 dark:hover:text-white transition-colors">
            Contact
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/terms" className="text-[11px] font-bold uppercase hover:text-teal-600 dark:hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/privacy-policy" className="text-[11px] font-bold uppercase hover:text-teal-600 dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/faqs" className="text-[11px] font-bold uppercase hover:text-teal-600 dark:hover:text-white transition-colors">
            FAQs
          </Link>
        </nav>

        {/* Right Side: Socials and Copyright */}
        <div className="flex items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-lg">
            <a href="#" className="hover:text-teal-600 dark:hover:text-white transition-colors"><FaFacebook /></a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-white transition-colors"><FaXTwitter /></a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-white transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-white transition-colors"><FaYoutube /></a>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center gap-2 border-l pl-6 border-gray-200 dark:border-gray-700">
            <span className="text-[11px]">© {currentYear} AyosDocs.com</span>
            
            {/* The Branding Diamond Icon */}
            <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                <div className="w-1.5 h-1.5 rotate-45 bg-gray-400 dark:bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;