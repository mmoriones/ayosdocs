'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircle, BookOpen } from 'lucide-react';
import { PublicPageHeader, SearchInput, Card, Badge, Button } from '@/components/ui';
import Link from 'next/link';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: "What is AyosDocs?",
        a: "AyosDocs is a platform that simplifies Philippine government document applications. We provide step-by-step guides and requirements checklists."
      },
      {
        q: "Is AyosDocs an official government website?",
        a: "No, AyosDocs is a private educational platform. We are not affiliated with any government agency. We aggregate and simplify official information for the benefit of the public."
      },
      {
        q: "Do I need to pay to use AyosDocs?",
        a: "No, our guides and discovery tools are completely free to use. Some advanced features like cloud-synced progress tracking require a free account."
      }
    ]
  },
  {
    category: 'Account & Tracking',
    questions: [
      {
        q: "Why should I create an account?",
        a: "An account allows you to save your progress on checklists, bookmark your most-needed guides, and sync your data across all your devices securely."
      },
      {
        q: "Is my personal data safe?",
        a: "We only store the data necessary for tracking your progress (email and guide status). We do not store sensitive government ID numbers or private documents."
      }
    ]
  },
  {
    category: 'Guides',
    questions: [
      {
        q: "Can I suggest a new guide?",
        a: "Absolutely! We're always looking to expand our library. You can reach out to us via the Contact page with your suggestions."
      }
    ]
  }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = ['All', ...faqData.map(f => f.category)];

  const filteredFAQs = faqData.flatMap((cat, catIdx) => 
    cat.questions
      .filter(q => 
        (activeCategory === 'All' || cat.category === activeCategory) &&
        (q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .map((q, qIdx) => ({ ...q, category: cat.category, globalIdx: `${catIdx}-${qIdx}` }))
  );

  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-700">
      <PublicPageHeader 
        icon={HelpCircle}
        title="Help Center"
        description="Find answers to common questions about requirements and tracking."
        actions={
          <Badge variant="secondary" className="!bg-[#007AFF]/10 !text-[#007AFF] !border-none flex items-center gap-1.5 px-4 py-1.5 shadow-sm">
            <BookOpen size={14} strokeWidth={2.5} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Guide Assistance</span>
          </Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 space-y-8">
        {/* Mobile Category Navigation - Pills style like Home Browse */}
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide flex gap-3 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[14px] font-bold transition-all shadow-sm active:scale-95 ${
                activeCategory === cat 
                  ? 'bg-[#0038A8] text-white shadow-[#0038A8]/20' 
                  : 'bg-white text-gray-500 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Desktop FAQ Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6 sticky top-24 h-fit">
            <Card 
              className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl"
              noPadding
            >
              <div className="p-6 border-b border-gray-100/50">
                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Categories</h3>
              </div>
              <div className="p-3 space-y-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all active:scale-[0.98] ${
                      activeCategory === cat 
                        ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl p-8 space-y-5" noPadding>
              <div className="flex items-center gap-3 text-[#AF52DE]">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                   <MessageCircle size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-[13px] font-bold uppercase tracking-widest">Support</h3>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                Our team is ready to assist you with specific documentation issues.
              </p>
              <Button as={Link} href="/support" variant="secondary" className="w-full !rounded-2xl !bg-white !border-gray-100 h-14 text-[14px] font-bold shadow-sm">
                Contact Support
              </Button>
            </Card>
          </aside>

          {/* Main FAQ Content */}
          <div className="flex-1 min-w-0 space-y-8">
            <div className="max-w-2xl">
              <SearchInput 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="shadow-sm"
              />
            </div>

            <div className="space-y-5">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <Card 
                    key={faq.globalIdx}
                    className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl group hover:bg-white transition-all duration-300"
                    noPadding
                  >
                    <button
                      onClick={() => toggleFAQ(faq.globalIdx)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left gap-6 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <Badge variant="secondary" className="!bg-gray-100 !text-gray-500 !text-[10px] font-black uppercase tracking-widest !border-none px-3 py-1">
                             {faq.category}
                           </Badge>
                        </div>
                        <h4 className="text-[18px] lg:text-[20px] font-bold text-[#1C1C1E] tracking-tight group-hover:text-[#007AFF] transition-colors leading-snug">
                          {faq.q}
                        </h4>
                      </div>
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        openIndex === faq.globalIdx 
                          ? 'bg-[#007AFF] text-white rotate-180 shadow-lg shadow-[#007AFF]/20' 
                          : 'bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-[#007AFF]'
                      }`}>
                        <ChevronDown size={22} strokeWidth={3} />
                      </div>
                    </button>
                    {openIndex === faq.globalIdx && (
                      <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-500">
                        <div className="p-7 bg-white/50 border border-gray-100/50 rounded-[24px] shadow-inner">
                          <p className="text-[16px] text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="!rounded-[40px] text-center py-24 border-dashed border-2 border-gray-100 bg-gray-50/30 shadow-none" noPadding>
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm">
                    <BookOpen size={36} className="text-gray-300" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#1C1C1E] uppercase tracking-widest">No results</h3>
                  <p className="text-[16px] text-gray-400 font-medium mt-2">Try a different search term or category.</p>
                </Card>
              )}
            </div>

            {/* Mobile Contact Action */}
            <div className="lg:hidden pt-8">
              <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl p-10 space-y-6 text-center" noPadding>
                  <div className="w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center text-[#AF52DE] shadow-sm mx-auto">
                    <MessageCircle size={32} strokeWidth={2} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[22px] font-bold text-[#1C1C1E]">Still have questions?</h3>
                    <p className="text-[15px] text-gray-400 font-medium leading-relaxed">
                      Our support team is ready to assist you with specific documentation issues.
                    </p>
                  </div>
                <Button as={Link} href="/support" className="w-full h-16 !rounded-[24px] text-[17px] font-bold shadow-lg shadow-[#0038A8]/10">
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
