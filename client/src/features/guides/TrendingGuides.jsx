import { FileText, BookOpen, ShieldCheck, CreditCard, UserCircle, ReceiptText } from 'lucide-react';
import { useState } from 'react';

const guides = [
  { id: 1, name: 'NBI Clearance', slug: 'nbi-clearance', icon: <FileText className="text-blue-800" /> },
  { id: 2, name: 'Passport Appointment', slug: 'passport-appointment', icon: <BookOpen className="text-red-800" /> },
  { id: 3, name: 'SSS Registration', slug: 'sss-registration', icon: <ShieldCheck className="text-blue-600" /> },
  { id: 4, name: 'UMID Card', slug: 'umid-card', icon: <CreditCard className="text-blue-900" /> },
  { id: 5, name: 'PhilHealth ID', slug: 'philhealth-id', icon: <UserCircle className="text-yellow-600" /> },
  { id: 6, name: 'Digital TIN ID', slug: 'tin-id', icon: <ReceiptText className="text-yellow-800" /> },
];

const TrendingGuides = ({ onSelectGuide }) => {
  return (
    <div className="mt-8 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 uppercase text-gray-800 dark:text-gray-100">
        Trending Guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onSelectGuide(guide.slug)}
            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all
              bg-white border-gray-200 
              dark:bg-[#242729] dark:border-gray-800 dark:hover:border-teal-900"
          >
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#1a1c1e]">
              {guide.icon}
            </div>
            <span className="font-bold text-sm text-gray-700 dark:text-gray-200">
              {guide.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

};

export default TrendingGuides;