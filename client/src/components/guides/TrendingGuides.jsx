import { FileText, BookOpen, ShieldCheck, CreditCard, UserCircle, ReceiptText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const guides = [
  { id: 1, name: 'NBI Clearance', slug: 'nbi-clearance', icon: <FileText className="text-blue-800" /> },
  { id: 2, name: 'Passport Appointment', slug: 'passport-appointment', icon: <BookOpen className="text-red-800" /> },
  { id: 3, name: 'SSS Registration', slug: 'sss-registration', icon: <ShieldCheck className="text-blue-600" /> },
  { id: 4, name: 'UMID Card', slug: 'umid-card', icon: <CreditCard className="text-blue-900" /> },
  { id: 5, name: 'PhilHealth ID', slug: 'philhealth-id', icon: <UserCircle className="text-yellow-600" /> },
  { id: 6, name: 'Digital TIN ID', slug: 'tin-id', icon: <ReceiptText className="text-yellow-800" /> },
];

const TrendingGuides = ({ onSelectGuide }) => {
  const navigate = useNavigate();
  const handleSelection = (slug) => {
    navigate(`/guides/${slug}`);
    onSelectGuide(slug);
  }
  return (
    <div className="mt-8 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 uppercase text-gray-800">
        Trending Guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => handleSelection(guide.slug)}
            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all
              bg-white border-gray-200"
          >
            <div className="p-2 rounded-lg bg-gray-50">
              {guide.icon}
            </div>
            <span className="font-bold text-sm text-gray-700">
              {guide.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

};

export default TrendingGuides;