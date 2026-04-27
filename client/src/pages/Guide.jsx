import { useParams } from "react-router-dom";
import { guidesMap } from "../utils/loadGuides";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import GuidePageLayout from "../features/guides/components/reader/GuidePageLayout";

const Guide = () => {
  const { slug } = useParams();
  const guide = guidesMap[slug];

  if (!guide) {
    return <div className="p-10 text-center">Guide not found</div>;
  }

  return (
    <GuidePageLayout
      title={guide.title}
      lastUpdated={guide.lastUpdated}
      checklistSteps={guide.checklist?.map(task => ({ task }))}
      headings={guide.headings}
      slug={slug}
    >
      <article className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm prose prose-teal max-w-none">
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
    </GuidePageLayout>
  );
};

export default Guide;
