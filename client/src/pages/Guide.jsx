import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import GuidePageLayout from "../components/guides/GuidePageLayout";

const extractHeadings = (markdown) => {
  const regex = /^##\s+(.*)/gm;
  const matches = [...markdown.matchAll(regex)];

  return matches.map((match) => {
    const text = match[1];

    const id = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

    return { text, id };
  });
};

const GuideDetail = () => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const fetchGuide = async () => {
      const res = await axios.get(
        `${API_URL}/api/guides/${slug}`
      );

      setGuide(res.data);
      setHeadings(extractHeadings(res.data.content));
    };

    fetchGuide();
  }, [slug]);

  if (!guide) return <div className="p-10 text-center">Loading...</div>;

  return (
    <GuidePageLayout
      title={guide.title}
      lastUpdated={guide.lastUpdated}
      guideName={guide.title}
      checklistSteps={guide.checklist}
      slug={slug}
    >
      <div className="flex gap-8 w-full">

        {/* TOC */}
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
  );


};

export default GuideDetail;
