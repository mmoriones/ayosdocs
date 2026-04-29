import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChecklistCard from '../tracking/ChecklistCard';
import TableOfContents from './TableOfContents';
import MobileBottomNav from './MobileBottomNav';
import GuideModal from './GuideModal';

const GuidePageLayout = ({
  title,
  lastUpdated,
  children,
  checklistSteps,
  headings,
  slug
}) => {
  const [activeModal, setActiveModal] = useState(null); // 'toc' or 'checklist'

  const toggleModal = (modalType) => {
    setActiveModal(prev => prev === modalType ? null : modalType);
  };

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
        <div className="flex-1 space-y-6 w-full">
          {/* HEADER CARD */}
          <header className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                GUIDE
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
                {title}
              </h1>
              <p className="text-sm text-gray-500">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* DESKTOP SIDEBAR (TOC) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 px-3">
                  On this page
                </h3>
                <TableOfContents headings={headings} />
              </div>
            </aside>

            {/* THE CONTENT (Markdown Article) */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>

        {/* DESKTOP RIGHT SIDEBAR (Checklist) */}
        <aside className="hidden lg:block w-96 space-y-6 sticky top-28 shrink-0">
          <ChecklistCard
            title={title}
            initialSteps={checklistSteps}
            slug={slug}
            isFullPage={true}
          />

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Need help?</p>
              <p className="text-sm text-gray-500">
                Check our resources or FAQs
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </aside>
      </div>

      {/* MOBILE INTERACTIVE ELEMENTS */}
      <MobileBottomNav
        onOpenTOC={() => toggleModal('toc')}
        onOpenChecklist={() => toggleModal('checklist')}
        isTOCOpen={activeModal === 'toc'}
        isChecklistOpen={activeModal === 'checklist'}
      />

      <GuideModal
        isOpen={activeModal === 'toc'}
        onClose={() => setActiveModal(null)}
        title="On this page"
      >
        <TableOfContents 
          headings={headings} 
          onItemClick={() => setActiveModal(null)} 
        />
      </GuideModal>

      <GuideModal
        isOpen={activeModal === 'checklist'}
        onClose={() => setActiveModal(null)}
        title="Requirements List"
        maxHeight="90vh"
      >
        <ChecklistCard
          title={title}
          initialSteps={checklistSteps}
          slug={slug}
          isModal={true}
        />
      </GuideModal>
    </div>
  );
};

export default GuidePageLayout;
