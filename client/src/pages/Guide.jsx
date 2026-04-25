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
      <div className="flex gap-10">

        {/* TABLE OF CONTENTS */}
        <aside className="w-60 hidden lg:block">
          <div className="sticky top-24">
            <h3 className="font-semibold mb-3">On this page</h3>

            <ul className="space-y-2 text-sm">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* GUIDE CONTENT */}
        <article className="prose max-w-none flex-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          >
            {guide.content}
          </ReactMarkdown>
        </article>

      </div>
    </GuidePageLayout>
  );
};

export default GuideDetail;
