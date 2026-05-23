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
import { useToast, useWorkspace } from '@/context';
import ChecklistCard from '../tracking/ChecklistCard';
import TableOfContents from './TableOfContents';
import MobileBottomNav from './MobileBottomNav';
import ChecklistModal from './ChecklistModal';
import RelatedGuides from './RelatedGuides';
import { GuideIcon } from '@/lib/guideIcons';
import { Banner, Tooltip, BookmarkButton, Tabs, Tab } from '@/components/ui';
import Adsense from '@/components/Adsense';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toggleFavoriteAction } from '@/app/actions/user';
import { useAuthUI } from '@/components/Providers';

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
  const { setActiveGuideSlug } = useWorkspace();
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const queryClient = useQueryClient();
  const observer = useRef(null);

  // Fetch comprehensive user data
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const progress = userData?.savedProgress?.find(p => p.guideSlug === slug);
  const isFavorite = progress?.isFavorite || false;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      if (!isVerified) {
        showToast({
          type: 'warning',
          title: 'Verification Required',
          message: 'Please verify your email to favorite guides.'
        });
        return;
      }
      const result = await toggleFavoriteAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
        message: data.message
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update favorite. Please try again.'
      });
    }
  });

  const handleBookmark = () => {
    favoriteMutation.mutate();
  };

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

  const toggleModal = (modalType) => {
    setActiveModal(prev => prev === modalType ? null : modalType);
  };

  useEffect(() => {
    // Persist as last visited guide via global context
    if (slug) {
      setActiveGuideSlug(slug);
    }

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

    // Small delay to ensure ReactMarkdown has finished rendering the content
    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.current.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.current?.disconnect();
    };
  }, [headings]);

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 pb-24">
      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        {/* MAIN CONTENT AREA */}
        <main className={`col-span-12 transition-all duration-300 ${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
          <div className="space-y-10">
            <div className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
              <header className="p-8 md:p-10 border-b border-ctp-surface1 bg-ctp-mantle/50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  <div className="p-4 rounded-xl bg-ctp-base shrink-0 w-fit shadow-sm border border-ctp-surface1">
                    <GuideIcon slug={slug} agency={agency} className="w-12 h-12 md:w-14 md:h-14 text-ctp-sky-800" strokeWidth={1.5} />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-ctp-sky-800/10 text-ctp-sky-800 text-[10px] font-bold uppercase tracking-widest border border-ctp-sky-800/20">
                        {category || 'GUIDE'}
                      </span>
                      <div className="flex items-center gap-2">
                        <BookmarkButton
                          isFavorite={isFavorite}
                          onClick={handleBookmark}
                        />
                        <button 
                          onClick={handleShare}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ctp-base border border-ctp-surface1 text-ctp-text hover:bg-ctp-mantle transition-all shadow-sm active:scale-95 font-bold text-xs"
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-ctp-text leading-tight tracking-tight">
                      {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Agency</span>
                        <span className="text-xs font-bold text-ctp-text">{agency || 'National Government'}</span>
                      </div>
                      <div className="w-px h-8 bg-ctp-surface1 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Updated</span>
                        <span className="text-xs font-bold text-ctp-text">{lastUpdated}</span>
                      </div>
                      <div className="w-px h-8 bg-ctp-surface1 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Read Time</span>
                        <span className="text-xs font-bold text-ctp-text">{readTime}</span>
                      </div>
                      <div className="w-px h-8 bg-ctp-surface1 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Difficulty</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ctp-sky-800">
                          <Sparkles size={12} />
                          <span>{difficulty}</span>
                        </div>
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
                  className="mb-10"
                >
                  This is a private educational website and is not affiliated with any government agency.
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
                <h2 className="text-xl font-bold text-ctp-text tracking-tight">Related Guides</h2>
              </div>
              <RelatedGuides 
                currentSlug={slug} 
                category={category}
                allGuides={allGuides}
              />
            </div>
          </div>
        </main>

        {/* GUIDE TOOLS SIDEBAR */}
        <aside className={`hidden lg:flex flex-col gap-6 sticky top-24 self-start transition-all duration-300 ${isSidebarCollapsed ? 'col-span-1 w-16' : 'col-span-3'}`}>
          <div className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm flex flex-col max-h-[calc(100vh-120px)] overflow-hidden transition-all">
            <div className={`p-4 border-b border-ctp-surface1 bg-ctp-mantle/50 shrink-0 transition-all ${isSidebarCollapsed ? 'pb-5' : 'pb-4'}`}>
              <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-6' : 'mb-4'}`}>
                {!isSidebarCollapsed && (
                  <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">
                    Guide Tools
                  </h3>
                )}
                <Tooltip content={isSidebarCollapsed ? "Expand tools" : "Collapse tools"} position="left">
                  <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1.5 rounded-lg text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-mantle transition-all active:scale-95"
                  >
                    {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                  </button>
                </Tooltip>
              </div>

              {!isSidebarCollapsed && (
                <Tabs className="w-full overflow-hidden">
                  <Tab 
                    active={activeTab === 'checklist'} 
                    onClick={() => setActiveTab('checklist')}
                    className="flex-1 flex justify-center gap-2"
                  >
                    <CheckSquare size={12} />
                    Tracker
                  </Tab>
                  <Tab 
                    active={activeTab === 'toc'} 
                    onClick={() => setActiveTab('toc')}
                    className="flex-1 flex justify-center gap-2"
                  >
                    <List size={12} />
                    Content
                  </Tab>
                </Tabs>
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
                    <TableOfContents headings={headings} activeId={activeId} />
                  </div>
                )}
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button 
              onClick={handleBookmark}
              className={`bg-ctp-mantle border rounded-xl p-4 flex items-center gap-3 group hover:bg-ctp-base transition-all shadow-sm text-left w-full ${
                isFavorite ? 'border-ctp-sky-800/30' : 'border-ctp-surface1'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg bg-ctp-base flex items-center justify-center border transition-transform group-hover:scale-105 ${
                isFavorite ? 'text-ctp-sky-800 border-ctp-sky-800 shadow-inner' : 'text-ctp-sky-800 border-ctp-surface1'
              }`}>
                <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ctp-text">{isFavorite ? 'Saved in favorites' : 'Bookmark guide'}</p>
                <p className="text-[10px] text-ctp-subtext1 font-medium truncate">Save for offline access</p>
              </div>
            </button>
          )}
        </aside>
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
