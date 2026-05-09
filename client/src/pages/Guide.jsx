import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { guidesMap } from "../utils/loadGuides";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import GuidePageLayout from "../features/guides/components/reader/GuidePageLayout";

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
      category={guide.category}
    >
      <article className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm prose prose-teal max-w-none">
        {/* ReactMarkdown converts the raw markdown content into stylized React components. */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          // Custom mapping of markdown elements to Tailwind-styled components for consistent look.
          components={{
            h2: ({ ...props }) => (
              <h2 className="text-xl font-semibold text-teal-700 mt-8 mb-3" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-gray-700 leading-relaxed mb-4" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-5 space-y-2 mb-4 text-gray-700" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="marker:text-teal-600" {...props} />
            ),
            strong: ({ ...props }) => (
              <strong className="text-gray-900 font-semibold" {...props} />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse border border-gray-100 rounded-xl overflow-hidden" {...props} />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            th: ({ ...props }) => (
              <th className="px-4 py-3 text-left text-sm font-semibold text-teal-700 border-b border-gray-100" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-50" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-gray-50/50 transition-colors" {...props} />
            ),
            hr: ({ ...props }) => (
              <hr className="my-8 border-t border-gray-200" {...props} />
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
