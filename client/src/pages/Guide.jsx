import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { guidesMap } from "../utils/loadGuides";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import GuidePageLayout from "../features/guides/components/reader/GuidePageLayout";
import Adsense from "../components/Adsense";

/**
 * Page component that renders a specific government guide.
 * Handles markdown parsing and dynamically injects meta tags for SEO.
 * 
 * @returns {JSX.Element} The rendered Guide page.
 */
const Guide = () => {
  const { slug } = useParams();
  const guide = guidesMap[slug];

  // Execution of side effects for tracking and metadata.
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Storage of the last viewed guide slug in localStorage.
      // This allows the Home page to suggest "Continue where you left off".
      localStorage.setItem("lastGuideSlug", slug);
      
      // Update of the document title based on the guide's specific title.
      if (guide?.title) {
        document.title = `${guide.title} | AyosDocs`;
      }
    }
  }, [slug, guide]);

  if (!guide) {
    return <div className="p-10 text-center">Guide not found</div>;
  }

  return (
    <>
      {/* Dynamic injection of meta tags for better SEO and social sharing (Open Graph). */}
      <title>{guide.title} | AyosDocs</title>
      <meta name="description" content={guide.description} />

      <link rel="canonical" href={`https://ayosdocs.com/guides/${slug}`} />

      {/* Open Graph */}
      <meta property="og:title" content={guide.title} />
      <meta property="og:description" content={guide.description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://ayosdocs.com/guides/${slug}`} />

      <GuidePageLayout
      title={guide.title}
      lastUpdated={guide.lastUpdated}
      // Mapping the flat checklist array from markdown frontmatter into the object structure required by the card.
      checklistSteps={guide.checklist?.map(task => ({ task }))}
      headings={guide.headings}
      slug={slug}
      agency={guide.agency}
      category={guide.category}
      difficulty={guide.difficulty}
      readTime={guide.estimatedTime}
    >
      <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-1000">
        <Adsense variant="article" />
      </div>
      <article className="prose prose-blue max-w-none prose-headings:text-ctp-text prose-p:text-ctp-subtext1 prose-strong:text-ctp-text prose-li:text-ctp-subtext1 prose-table:border-ctp-surface0 prose-th:text-ctp-sapphire prose-td:text-ctp-subtext1">
        {/* ReactMarkdown converts the raw markdown content into stylized React components. */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          // Custom mapping of markdown elements to Tailwind-styled components for consistent look.
          components={{
            h2: ({ ...props }) => (
              <h2 className="text-3xl font-black text-ctp-sapphire mt-16 mb-8 tracking-tight" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-2xl font-bold text-ctp-text mt-12 mb-6 tracking-tight" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-[18px] text-ctp-subtext1 font-medium leading-relaxed mb-8" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-8 space-y-4 mb-8 text-ctp-subtext1" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-8 space-y-4 mb-8 text-ctp-subtext1" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="marker:text-ctp-sapphire font-medium text-[18px]" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <div className="my-10 bg-ctp-sapphire/5 border-l-4 border-ctp-sapphire rounded-2xl p-8 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-ctp-base flex items-center justify-center text-ctp-sapphire shrink-0 shadow-sm border border-ctp-sapphire/10">
                    <Sparkles size={20} />
                  </div>
                  <div className="prose-p:mb-0 prose-p:text-ctp-text prose-p:font-bold italic" {...props} />
                </div>
              </div>
            ),
            strong: ({ ...props }) => (
              <strong className="text-ctp-text font-black" {...props} />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-10 rounded-2xl border border-ctp-surface0">
                <table className="w-full border-collapse" {...props} />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-ctp-base" {...props} />
            ),
            th: ({ ...props }) => (
              <th className="px-6 py-4 text-left text-xs font-black text-ctp-sapphire uppercase tracking-[0.2em] border-b border-ctp-surface0" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-6 py-4 text-[14px] text-ctp-subtext1 border-b border-ctp-surface0 font-medium" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-ctp-base/30 transition-colors last:prose-td:border-b-0" {...props} />
            ),
            hr: ({ ...props }) => (
              <hr className="my-12 border-t border-ctp-surface0" {...props} />
            ),
          }}
        >
          {guide.content}
        </ReactMarkdown>
      </article>
    </GuidePageLayout>
   </> 
  );
};

export default Guide;
