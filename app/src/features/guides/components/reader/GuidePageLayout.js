'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  History, 
  Share2, 
  Bookmark, 
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Info,
  List,
  CheckSquare,
  Settings2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import ChecklistCard from '../tracking/ChecklistCard';
import TableOfContents from './TableOfContents';
import MobileBottomNav from './MobileBottomNav';
import ChecklistModal from './ChecklistModal';
import RelatedGuides from './RelatedGuides';
import { GuideIcon } from '@/lib/guideIcons';
import Banner from '@/components/ui/Banner';
import Adsense from '@/components/Adsense';

/**
 * Layout component for the Guide Page.
 */
const GuidePageLayout = ({
  title,
  lastUpdated,
  children,
  checklistSteps,
  headings,
  slug,
  agency,
  category,
  difficulty = "Beginner Friendly",
  readTime = "10-15 mins",
  allGuides = []
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeId, setActiveId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist');
  const { showToast } = useToast();
  const observer = useRef(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | AyosDocs`,
        text: `Check out this government guide on AyosDocs: ${title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Guide URL has been copied to your clipboard.'
      });
    }
  };

  const handleBookmark = () => {
    showToast({
      type: 'info',
      title: 'Guide Bookmarked',
      message: 'This guide has been saved to your favorites.'
    });
  };

  const toggleModal = (modalType) => {
    setActiveModal(prev => prev === modalType ? null : modalType);
  };

  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-100px 0px -60% 0px",
    });

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.current.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [headings]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 pb-24 space-y-10">
      <div className="flex items-center justify-between">
        <Link 
          href="/guides" 
          className="group inline-flex items-center gap-3 text-xs font-semibold text-ctp-subtext0 hover:text-ctp-sky transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-ctp-surface0 flex items-center justify-center transition-transform group-hover:-translate-x-1 border border-ctp-surface1">
            <ArrowLeft size={14} />
          </div>
          Back to Guides
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
        <aside className={`hidden lg:flex flex-col gap-6 sticky top-28 transition-all duration-300 ${isSidebarCollapsed ? 'col-span-1 w-20' : 'col-span-3'}`}>
          <div className="bg-ctp-mantle border border-ctp-surface1 rounded-2xl shadow-sm flex flex-col max-h-[calc(100vh-140px)] overflow-hidden transition-all">
            <div className={`p-5 border-b border-ctp-surface1 bg-ctp-crust/10 shrink-0 transition-all ${isSidebarCollapsed ? 'pb-6' : 'pb-4'}`}>
              <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-6' : 'mb-4'}`}>
                {!isSidebarCollapsed ? (
                  <h3 className="text-xs font-bold text-ctp-subtext1 uppercase tracking-wider">
                    Guide Tools
                  </h3>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-subtext1 border border-ctp-surface1 shadow-sm">
                    <Settings2 size={18} />
                  </div>
                )}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface0 transition-all active:scale-95"
                >
                  {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
              </div>

              {!isSidebarCollapsed && (
                <div className="flex bg-ctp-base p-1 rounded-xl border border-ctp-surface1">
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'checklist' 
                        ? 'bg-ctp-sky text-ctp-base shadow-sm' 
                        : 'text-ctp-subtext1 hover:text-ctp-text'
                    }`}
                  >
                    <CheckSquare size={14} />
                    Tracker
                  </button>
                  <button
                    onClick={() => setActiveTab('toc')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'toc' 
                        ? 'bg-ctp-sky text-ctp-base shadow-sm' 
                        : 'text-ctp-subtext1 hover:text-ctp-text'
                    }`}
                  >
                    <List size={14} />
                    Content
                  </button>
                </div>
              )}
            </div>
            
            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {activeTab === 'checklist' ? (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <ChecklistCard
                      title={title}
                      initialSteps={checklistSteps}
                      slug={slug}
                      agency={agency}
                      inGuidePage={true}
                      isBare={true}
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <h4 className="text-[11px] font-bold text-ctp-subtext1 uppercase tracking-wider mb-4 px-1">
                      Sections
                    </h4>
                    <TableOfContents headings={headings} activeId={activeId} />
                  </div>
                )}
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button 
              onClick={handleBookmark}
              className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-4 flex items-center gap-3 group hover:bg-ctp-surface0 transition-all shadow-sm text-left w-full"
            >
              <div className="w-9 h-9 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky border border-ctp-surface1 transition-transform group-hover:scale-105">
                <Bookmark size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-ctp-text">Bookmark guide</p>
                <p className="text-[10px] text-ctp-subtext1 font-medium">Save for later</p>
              </div>
            </button>
          )}
        </aside>

        <main className={`col-span-12 transition-all duration-300 ${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
          <div className="space-y-10">
            <div className="bg-ctp-base border border-ctp-surface1 rounded-2xl shadow-sm overflow-hidden">
              <header className="p-8 md:p-10 border-b border-ctp-surface1 bg-ctp-mantle/50">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="p-5 rounded-2xl bg-ctp-base shrink-0 w-fit shadow-sm border border-ctp-surface1">
                    <GuideIcon slug={slug} agency={agency} className="w-12 h-12 md:w-16 md:h-16 text-ctp-sky-800" strokeWidth={1} />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-ctp-sky/10 text-ctp-sky text-[10px] font-bold uppercase tracking-wider border border-ctp-sky/20">
                        {category || 'GUIDE'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleBookmark}
                          className="p-2 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-sky hover:border-ctp-sky/30 transition-all shadow-sm active:scale-95"
                        >
                          <Bookmark size={18} />
                        </button>
                        <button 
                          onClick={handleShare}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle transition-all shadow-sm active:scale-95 font-bold text-xs"
                        >
                          <Share2 size={16} />
                          Share
                        </button>
                      </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-ctp-text leading-tight tracking-tight">
                      {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-center gap-2 text-ctp-subtext1 font-medium text-[11px]">
                        <History size={14} className="text-ctp-sky" />
                        Updated: {lastUpdated}
                      </div>
                      <div className="flex items-center gap-2 text-ctp-subtext1 font-medium text-[11px]">
                        <Clock size={14} className="text-ctp-sky" />
                        {readTime}
                      </div>
                      <div className="flex items-center gap-2 text-ctp-sky font-bold text-[10px] uppercase tracking-wider bg-ctp-sky/5 px-2.5 py-1 rounded-lg border border-ctp-sky/10">
                        <Sparkles size={14} />
                        {difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-8 md:p-10 lg:p-12">
                <Banner
                  variant="orange"
                  icon={AlertCircle}
                  title="Legal Disclaimer"
                  className="mb-8"
                >
                  This is a private educational website and is not affiliated with, endorsed by, or sponsored by any government agency.
                </Banner>

                <div className="min-w-0 prose prose-ctp max-w-none">
                  {children}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Adsense variant="article" />
            </div>

            <div className="mt-12 pt-12 border-t border-ctp-surface1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-ctp-mauve/10 flex items-center justify-center text-ctp-mauve border border-ctp-mauve/20 shadow-sm">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-ctp-text tracking-tight">You might also need</h2>
              </div>
              <RelatedGuides 
                currentSlug={slug} 
                category={category}
                allGuides={allGuides}
              />
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav
        onOpenTOC={() => toggleModal('toc')}
        onOpenChecklist={() => toggleModal('checklist')}
        isTOCOpen={activeModal === 'toc'}
        isChecklistOpen={activeModal === 'checklist'}
      />

      <ChecklistModal
        isOpen={activeModal === 'toc'}
        onClose={() => setActiveModal(null)}
        title="On this page"
      >
        <TableOfContents 
          headings={headings} 
          onItemClick={() => setActiveModal(null)} 
          activeId={activeId}
        />
      </ChecklistModal>

      <ChecklistModal
        isOpen={activeModal === 'checklist'}
        onClose={() => setActiveModal(null)}
        title="Requirements List"
        maxHeight="90vh"
      >
        <ChecklistCard
          title={title}
          initialSteps={checklistSteps}
          slug={slug}
          agency={agency}
          inGuidePage={true}
          isModal={true}
        />
      </ChecklistModal>
    </div>
  );
};

export default GuidePageLayout;
