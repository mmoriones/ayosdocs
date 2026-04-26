import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { guidesMap } from "../utils/loadGuides";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { X } from "lucide-react";

import GuidePageLayout from "../components/guides/GuidePageLayout";
import MobileBottomNav from "../components/guides/MobileBottomNav";
import ChecklistCard from "../components/guides/ChecklistCard";

const Guide = () => {
  const { slug } = useParams();
  const guide = guidesMap[slug];

  const [showTOC, setShowTOC] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    const lockScroll = () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };
    
    const unlockScroll = () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };

    if (showTOC || showChecklist) {
      lockScroll();
    } else {
      unlockScroll();
    }
    
    return () => unlockScroll();
  }, [showTOC, showChecklist]);

  if (!guide) {
    return <div className="p-10 text-center">Guide not found</div>;
  }

  const headings = guide.headings;

  return (
    <>
      <GuidePageLayout
        title={guide.title}
        lastUpdated={guide.lastUpdated}
        guideName={guide.title}
        checklistSteps={guide.checklist?.map(task => ({ task }))}
        slug={slug}
      >
        <div className="flex gap-8 w-full">

          {/* DESKTOP TOC */}
          <aside className="hidden lg:block w-64">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                On this page
              </h3>

              <ul className="space-y-2 text-sm">
                {headings.map((h, index) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition"
                    >
                      {index + 1}. {h.text}
                    </a>
                  </li>
                ))}
              </ul>

            </div>
          </aside>

          {/* ARTICLE */}
          <article className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm prose prose-teal max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                          components={{
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-semibold text-teal-700 mt-8 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed mb-4" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 space-y-2 mb-4 text-gray-700" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="marker:text-teal-600" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-gray-900 font-semibold" {...props} />
              ),
            }}
            >
              {guide.content}
            </ReactMarkdown>
          </article>

        </div>
      </GuidePageLayout>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav
        onOpenTOC={() => {
          setShowTOC(!showTOC);
          setShowChecklist(false);
        }}
        onOpenChecklist={() => {
          setShowChecklist(!showChecklist);
          setShowTOC(false);
        }}
        isTOCOpen={showTOC}
        isChecklistOpen={showChecklist}
      />

      {/* TOC MODAL */}
      {showTOC && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:hidden touch-none">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 touch-auto">
            
            {/* FIXED HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">On this page</h3>
            </div>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <ul className="space-y-1">
                {headings.map((h, index) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={() => setShowTOC(false)}
                      className="block py-3 px-4 rounded-xl text-gray-600 active:bg-gray-50 active:text-teal-600 transition-colors"
                    >
                      <span className="text-gray-300 mr-3 text-sm font-medium">{String(index + 1).padStart(2, '0')}</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CHECKLIST MODAL */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end lg:hidden touch-none">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 touch-auto">
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 pb-28">
              <ChecklistCard
                title={guide.title}
                initialSteps={guide.checklist?.map(task => ({ task }))}
                slug={slug}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Guide;
