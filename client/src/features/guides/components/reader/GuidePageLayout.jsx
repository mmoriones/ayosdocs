import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChecklistCard from '../tracking/ChecklistCard';
import TableOfContents from './TableOfContents';
import MobileBottomNav from './MobileBottomNav';
import ChecklistModal from './ChecklistModal';
import RelatedGuides from './RelatedGuides';
import { getGuideIcon } from '../../../../utils/guideIcons';

const GuidePageLayout = ({
  title,
  lastUpdated,
  children,
  checklistSteps,
  headings,
  slug,
  category
}) => {
  const [activeModal, setActiveModal] = useState(null); // 'toc' or 'checklist'
  const [activeId, setActiveId] = useState("");
  const observer = useRef(null);

  const toggleModal = (modalType) => {
    setActiveModal(prev => prev === modalType ? null : modalType);
  };

  // Track active heading on scroll
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
    <div className="px-6 lg:px-10 py-6 pb-20 space-y-6">
      {/* BACK BUTTON */}
      <Link
        to="/my-progress"
        className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to My Progress
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 space-y-6">
          {/* HEADER CARD */}
          <header className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 rounded-2xl bg-gray-50 shrink-0 w-fit">
                <img 
                  src={getGuideIcon(slug)} 
                  alt="" 
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  {category || 'GUIDE'}
                </span>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
                  {title}
                </h1>
                <p className="text-sm text-gray-500">
                  Last Updated: {lastUpdated?.toString()}
                </p>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* DESKTOP SIDEBAR (TOC) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 z-30 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col max-h-[calc(100vh-120px)]">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 px-3 shrink-0">
                  On this page
                </h3>
                <div className="overflow-y-auto custom-scrollbar pr-1">
                  <TableOfContents headings={headings} activeId={activeId} />
                </div>
              </div>
            </aside>

            {/* THE CONTENT (Markdown Article) */}
            <main className="flex-1 min-w-0">
              {children}
              
              {/* RELATED GUIDES (Visible on both mobile & desktop) */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <RelatedGuides 
                  currentSlug={slug} 
                  category={category} 
                />
              </div>
            </main>
          </div>
        </div>

        {/* DESKTOP RIGHT SIDEBAR (Checklist) */}
        <aside className="hidden lg:block w-96 sticky top-28 z-30 shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 pb-4 custom-scrollbar">
          <ChecklistCard
            title={title}
            initialSteps={checklistSteps}
            slug={slug}
            inGuidePage={true}
          />
        </aside>      </div>

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
