'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircle, Sparkles, BookOpen } from 'lucide-react';
import { PublicPageHeader, SearchInput, Card, Badge, Button } from '@/components/ui';
import Link from 'next/link';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: "What is AyosDocs?",
        a: "AyosDocs is a platform that simplifies Philippine government document applications. We provide step-by-step guides, requirements checklists, and community-reported wait times."
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
    category: 'Guides & Offices',
    questions: [
      {
        q: "How accurate is the wait time data?",
        a: "Wait times are crowdsourced from recent community reports. While they provide a good estimate, actual processing times may vary based on specific office conditions."
      },
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

  const filteredFAQs = faqData.flatMap((cat, catIdx) => 
    cat.questions
      .filter(q => 
        (activeCategory === 'All' || cat.category === activeCategory) &&
        (q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .map((q, qIdx) => ({ ...q, category: cat.category, globalIdx: `${catIdx}-${qIdx}` }))
  );

  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-500">
      <PublicPageHeader 
        icon={HelpCircle}
        title="Help Center"
        description="Find answers to common questions about requirements and tracking."
        actions={
          <Badge variant="sky" icon={Sparkles}>Instant answers</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* FAQ Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <Card 
              title="Categories"
              background="mantle"
              noPadding
              headerClassName="!py-3"
            >
              <div className="p-2 space-y-1">
                {['All', ...faqData.map(f => f.category)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === cat 
                        ? 'bg-ctp-sky-800 text-white shadow-md' 
                        : 'text-ctp-subtext1 hover:bg-ctp-base hover:text-ctp-text'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Card>

            <Card background="mantle" className="space-y-4">
              <div className="flex items-center gap-3 text-ctp-mauve">
                <MessageCircle size={18} strokeWidth={2.5} />
                <h3 className="text-ui-micro font-bold uppercase tracking-widest">Still Stuck?</h3>
              </div>
              <p className="text-xs text-ctp-subtext1 leading-relaxed font-medium">
                Our support team is ready to assist you with specific documentation issues.
              </p>
              <Button as={Link} href="/support" variant="secondary" className="w-full bg-ctp-base">
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
              />
            </div>

            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div 
                    key={faq.globalIdx}
                    className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden group hover:border-ctp-sky-800/30 transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.globalIdx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                    >
                      <div className="min-w-0">
                        <Badge variant="sky" className="mb-2 opacity-80">{faq.category}</Badge>
                        <h4 className="text-sm font-bold text-ctp-text tracking-tight group-hover:text-ctp-sky-800 transition-colors">{faq.q}</h4>
                      </div>
                      <div className={`shrink-0 p-1.5 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 transition-transform duration-300 ${openIndex === faq.globalIdx ? 'rotate-180 text-ctp-sky-800 shadow-inner' : ''}`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>
                    {openIndex === faq.globalIdx && (
                      <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-5 bg-ctp-base/50 border border-ctp-surface1 rounded-lg">
                          <p className="text-sm text-ctp-subtext1 leading-relaxed font-medium">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Card background="mantle" className="text-center py-20 border-dashed">
                  <div className="w-14 h-14 bg-ctp-base rounded-xl flex items-center justify-center mx-auto mb-6 border border-ctp-surface1 shadow-inner shadow-sm">
                    <BookOpen size={24} className="text-ctp-subtext1" />
                  </div>
                  <h3 className="text-lg font-bold text-ctp-text uppercase tracking-widest">No matching questions</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium mt-1">Try a different search term or category.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
