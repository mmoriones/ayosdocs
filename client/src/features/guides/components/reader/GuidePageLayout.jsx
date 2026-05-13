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
  Settings2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ChecklistCard from '../tracking/ChecklistCard';
import TableOfContents from './TableOfContents';
import MobileBottomNav from './MobileBottomNav';
import ChecklistModal from './ChecklistModal';
import RelatedGuides from './RelatedGuides';
import TipsCard from '../callouts/TipsCard';
import { getGuideIcon } from '../../../../utils/guideIcons';
import Banner from '../../../../components/ui/Banner';
import Adsense from '../../../../components/Adsense';

/**
 * Layout component for the Guide Page.
 * Implements a unified tabbed sidebar on the left for Checklist and TOC.
 */
const GuidePageLayout = ({
  title,
  lastUpdated,
  children,
  checklistSteps,
  headings,
  slug,
  category,
  difficulty = "Beginner Friendly",
  readTime = "10-15 mins"
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeId, setActiveId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' or 'toc'
  const [showTip, setShowTip] = useState(true);
  const observer = useRef(null);

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
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-10 pb-24 space-y-10">

      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          to="/guides"
          className="group inline-flex items-center gap-4 text-[11px] font-black text-ctp-green uppercase tracking-[0.2em] hover:text-ctp-green-500 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-ctp-green/10 flex items-center justify-center transition-transform group-hover:-translate-x-1">
            <ArrowLeft size={18} />
          </div>
          Back to Knowledge Base
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-14 items-start">

        {/* UNIFIED TABBED SIDEBAR (Sticky + Collapsible) */}
        <aside className={`hidden lg:flex flex-col gap-6 sticky top-28 transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'col-span-1 w-20' : 'col-span-3'}`}>
          <div className="bg-ctp-mantle border border-ctp-surface0 rounded-[2.5rem] shadow-sm flex flex-col max-h-[calc(100vh-140px)] overflow-hidden transition-all duration-500">
            
            {/* SIDEBAR HEADER & TAB SWITCHER */}
            <div className={`p-6 border-b border-ctp-surface0 bg-ctp-crust/20 shrink-0 transition-all ${isSidebarCollapsed ? 'pb-8' : 'pb-4'}`}>
              <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-8' : 'mb-6'}`}>
                {!isSidebarCollapsed ? (
                  <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em]">
                    Guide Tools
                  </h3>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-ctp-mantle/30 flex items-center justify-center text-ctp-surface2 border border-ctp-surface0/50 mb-2 shrink-0 transition-all">
                    <Settings2 size={22} />
                  </div>
                )}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`p-2.5 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-text transition-all active:scale-90 shadow-sm ${isSidebarCollapsed ? 'w-12 h-12 flex items-center justify-center' : ''}`}
                >
                  {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={18} />}
                </button>
              </div>

              {isSidebarCollapsed && (
                <div className="flex flex-col gap-4 mt-4 items-center">
                   <button 
                    onClick={() => { setIsSidebarCollapsed(false); setActiveTab('checklist'); }}
                    className={`p-3 rounded-xl transition-all ${activeTab === 'checklist' ? 'bg-ctp-green text-ctp-base shadow-lg shadow-ctp-green/20' : 'text-ctp-subtext1 hover:bg-ctp-mantle'}`}
                   >
                     <CheckSquare size={20} />
                   </button>
                   <button 
                    onClick={() => { setIsSidebarCollapsed(false); setActiveTab('toc'); }}
                    className={`p-3 rounded-xl transition-all ${activeTab === 'toc' ? 'bg-ctp-green text-ctp-base shadow-lg shadow-ctp-green/20' : 'text-ctp-subtext1 hover:bg-ctp-mantle'}`}
                   >
                     <List size={20} />
                   </button>
                </div>
              )}

              {!isSidebarCollapsed && (
                <div className="flex bg-ctp-base p-1.5 rounded-2xl border border-ctp-surface0">
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'checklist' 
                        ? 'bg-ctp-green text-ctp-base shadow-lg shadow-ctp-green/20' 
                        : 'text-ctp-subtext1 hover:text-ctp-text'
                    }`}
                  >
                    <CheckSquare size={14} />
                    Tracker
                  </button>
                  <button
                    onClick={() => setActiveTab('toc')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'toc' 
                        ? 'bg-ctp-green text-ctp-base shadow-lg shadow-ctp-green/20' 
                        : 'text-ctp-subtext1 hover:text-ctp-text'
                    }`}
                  >
                    <List size={14} />
                    Content
                  </button>
                </div>
              )}
            </div>
            
            {/* SCROLLABLE SIDEBAR CONTENT */}
            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab === 'checklist' ? (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <ChecklistCard
                      title={title}
                      initialSteps={checklistSteps}
                      slug={slug}
                      inGuidePage={true}
                      isBare={true}
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <h4 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] mb-6 px-2">
                      Jump to Section
                    </h4>
                    <TableOfContents headings={headings} activeId={activeId} />
                  </div>
                )}
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="bg-ctp-green/5 border border-ctp-green/10 rounded-[2rem] p-6 flex flex-col gap-4 group cursor-pointer hover:bg-ctp-green/10 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-green shadow-xs border border-ctp-surface0 transition-transform group-hover:scale-110">
                  <Bookmark size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-ctp-text uppercase tracking-tight">Bookmark guide</p>
                  <p className="text-[10px] text-ctp-subtext1 font-bold uppercase tracking-widest">Save for later</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MIDDLE COLUMN: Main Content - NOW LARGER AND CENTERED */}
        <main className={`col-span-12 transition-all duration-300 ${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
          <div className="space-y-12">
            
            <div className="bg-ctp-mantle border border-ctp-surface0 rounded-[3rem] shadow-sm overflow-hidden">
              {/* HEADER SECTION */}
              <header className="p-8 md:p-12 border-b border-ctp-surface0 relative overflow-hidden group bg-ctp-crust/30">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-green/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  <div className="p-6 rounded-[2rem] bg-ctp-base shrink-0 w-fit shadow-inner border border-ctp-surface0">
                    <img 
                      src={getGuideIcon(slug)} 
                      alt="" 
                      className="w-14 h-14 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-ctp-green/10 text-ctp-green text-[10px] font-black uppercase tracking-[0.2em] border border-ctp-green/20">
                        {category || 'GUIDE'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-green transition-all shadow-xs active:scale-95">
                          <Bookmark size={18} />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ctp-base border border-ctp-surface0 text-ctp-text hover:bg-ctp-mantle transition-all shadow-xs active:scale-95 font-black text-[11px] uppercase tracking-widest">
                          <Share2 size={16} />
                          Share
                        </button>
                      </div>
                    </div>

                    <h1 className="text-[32px] md:text-[48px] font-black text-ctp-text leading-tight tracking-tight uppercase">
                      {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-ctp-subtext0 font-black text-[10px] uppercase tracking-widest">
                        <History size={14} className="text-ctp-green" />
                        Updated: {lastUpdated?.toString()}
                      </div>
                      <div className="flex items-center gap-2 text-ctp-subtext0 font-black text-[10px] uppercase tracking-widest">
                        <Clock size={14} className="text-ctp-green" />
                        {readTime}
                      </div>
                      <div className="flex items-center gap-2 text-ctp-green font-black text-[10px] uppercase tracking-widest bg-ctp-green/5 px-3 py-1 rounded-full border border-ctp-green/10">
                        <Sparkles size={14} />
                        {difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-8 md:p-12 lg:p-16 space-y-10">
                {/* TIP BANNER */}
                {showTip && (
                  <Banner
                    variant="teal"
                    icon={Info}
                    title="Tip"
                    onClose={() => setShowTip(false)}
                    className="mb-4"
                  >
                    Bookmark guides you need and track your progress in <Link to="/my-progress" className="underline font-black">My Progress</Link>.
                  </Banner>
                )}

                {/* ARTICLE CONTENT */}
                <div className="min-w-0">
                  {children}
                </div>
              </div>
            </div>

            {/* Bottom Ad Placement */}
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
              <Adsense variant="article" />
            </div>

            {/* RELATED GUIDES */}
            <div className="mt-16 pt-16 border-t border-ctp-surface0">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-ctp-mauve/10 flex items-center justify-center text-ctp-mauve border border-ctp-mauve/20 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">You might also need</h2>
              </div>
              <RelatedGuides 
                currentSlug={slug} 
                category={category} 
              />
            </div>
          </div>
        </main>

      </div>

      {/* MOBILE INTERACTIVE ELEMENTS */}
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
          inGuidePage={true}
          isModal={true}
        />
      </ChecklistModal>
    </div>
  );
};

export default GuidePageLayout;
