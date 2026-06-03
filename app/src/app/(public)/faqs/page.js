'use client';

import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageCircle, 
  BookOpen, 
  User, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { PublicPageHeader, SearchInput, Card, Badge, Button } from '@/components/ui';
import Link from 'next/link';

const faqData = [
  {
    category: 'General',
    icon: HelpCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
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
    icon: User,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
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
    icon: BookOpen,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
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

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return faqData.map((group, groupIdx) => {
      const filteredQuestions = group.questions.filter(q => 
        (activeCategory === 'All' || group.category === activeCategory) &&
        (q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query))
      ).map((q, qIdx) => ({ ...q, globalIdx: `${groupIdx}-${qIdx}` }));

      return { ...group, filteredQuestions };
    }).filter(group => group.filteredQuestions.length > 0);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-full pb-32 animate-in fade-in duration-700 relative overflow-hidden">
      {/* High-Fidelity Discovery Header */}
      <header className="px-6 pt-16 pb-10 max-w-[1600px] mx-auto lg:px-10">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h1 className="text-[34px] lg:text-[52px] font-black text-[#1C1C1E] tracking-tight leading-none">
            Help Center
          </h1>
          <p className="text-[16px] lg:text-[19px] font-medium text-gray-500 mt-2 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Find answers to common questions about government requirements, tracking, and account management.
          </p>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-12 relative z-10">
        {/* Command Center: Search & Categories */}
        <section className="space-y-8">
          <div className="max-w-3xl relative group">
             <SearchInput 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="h-16 shadow-[0_8px_32px_rgba(0,56,168,0.04)]"
              />
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {setActiveCategory(cat); setOpenIndex(null);}}
                className={`px-6 py-3 rounded-full text-[13px] font-bold whitespace-nowrap border transition-all active:scale-95 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-[#0038A8] text-white border-[#0038A8] shadow-[0_8px_20px_rgba(0,56,168,0.15)]'
                    : 'bg-white/80 backdrop-blur-md text-gray-500 border-white/60 hover:border-[#0038A8]/30 hover:text-[#0038A8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main FAQ Content */}
          <div className="flex-1 min-w-0 space-y-12">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.category} className="space-y-5">
                  <div className="flex items-center gap-3 px-2">
                    <div className={`w-10 h-10 rounded-xl ${group.bg} ${group.color} flex items-center justify-center shadow-sm border border-black/5`}>
                       <group.icon size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[19px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">{group.category}</h3>
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] ml-auto">{group.filteredQuestions.length} {group.filteredQuestions.length > 1 ? 'Items' : 'Item'}</span>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                    {group.filteredQuestions.map((faq, idx) => (
                      <FAQItem 
                        key={faq.globalIdx}
                        faq={faq}
                        isOpen={openIndex === faq.globalIdx}
                        onClick={() => toggleFAQ(faq.globalIdx)}
                        isLast={idx === group.filteredQuestions.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[40px] border border-dashed border-white/60 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                  <Search size={36} className="text-gray-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1C1C1E] uppercase tracking-widest">No results</h3>
                <p className="text-[16px] text-gray-400 font-medium mt-2 max-w-[280px]">Try a different search term or category.</p>
                <Button 
                  variant="ghost" 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                  className="mt-8 text-[#0038A8] font-bold"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Desktop FAQ Sidebar - Action Cards */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-8">
            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 space-y-6 relative group" noPadding>
              <div className="flex items-center gap-4 text-[#AF52DE]">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100/50 shadow-sm group-hover:rotate-6 transition-transform duration-500">
                   <MessageCircle size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-[0.2em]">Live Support</h3>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                Can&apos;t find what you&apos;re looking for? Our team is ready to assist you directly.
              </p>
              <Button as={Link} href="/support" className="w-full !rounded-2xl bg-[#0038A8] text-white h-14 text-[14px] font-black shadow-lg shadow-[#0038A8]/20 active:scale-95 transition-all">
                Contact Support
              </Button>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
            </Card>

            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 space-y-4" noPadding>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Information Accuracy</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                Our FAQs are updated regularly to reflect changes in platform features and government processing standards.
              </p>
            </Card>
          </aside>
        </div>

        {/* Mobile Contact Action */}
        <div className="lg:hidden pt-8 pb-12">
          <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl p-10 space-y-6 text-center relative overflow-hidden" noPadding>
              <div className="w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center text-[#AF52DE] shadow-sm mx-auto relative z-10">
                <MessageCircle size={32} strokeWidth={2} />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-[22px] font-black text-[#1C1C1E]">Still have questions?</h3>
                <p className="text-[15px] text-gray-400 font-medium leading-relaxed">
                  Our support team is ready to assist you with specific documentation issues.
                </p>
              </div>
            <Button as={Link} href="/support" className="w-full h-16 !rounded-[24px] text-[17px] font-black shadow-lg shadow-[#0038A8]/20 bg-[#0038A8] text-white relative z-10 active:scale-95 transition-all">
              Contact Support
            </Button>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full" />
          </Card>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] -right-20 w-80 h-80 bg-[#007AFF]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -left-20 w-96 h-96 bg-[#AF52DE]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

function FAQItem({ faq, isOpen, onClick, isLast }) {
  return (
    <div className={`${!isLast ? 'border-b border-gray-100/50' : ''} transition-all duration-500 ${isOpen ? 'bg-white/40' : ''}`}>
      <button
        onClick={onClick}
        className="w-full px-8 py-7 flex items-center justify-between text-left gap-6 group"
      >
        <h4 className={`text-[17px] lg:text-[19px] font-bold tracking-tight transition-colors duration-300 ${
          isOpen ? 'text-[#0038A8]' : 'text-[#1C1C1E] group-hover:text-[#0038A8]'
        }`}>
          {faq.q}
        </h4>
        <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          isOpen 
            ? 'bg-[#0038A8] text-white rotate-180 shadow-lg shadow-[#0038A8]/20' 
            : 'bg-gray-50 text-gray-300 group-hover:bg-[#0038A8]/5 group-hover:text-[#0038A8]'
        }`}>
          <ChevronDown size={18} strokeWidth={3} />
        </div>
      </button>
      {isOpen && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-500">
          <div className="p-7 bg-white/60 border border-gray-100/30 rounded-[24px] shadow-inner">
            <p className="text-[16px] lg:text-[17px] text-gray-500 font-medium leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
