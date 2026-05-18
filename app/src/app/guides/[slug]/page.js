import { getGuideBySlug, getGuideSlugs, getAllGuides } from '@/lib/guides';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import GuidePageLayout from '@/features/guides/components/reader/GuidePageLayout';
import Adsense from '@/components/Adsense';
import { Sparkles } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = getGuideSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: `${guide.title} | AyosDocs`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: `https://ayosdocs.com/guides/${slug}`,
    },
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  const allGuides = getAllGuides();

  if (!guide) {
    notFound();
  }

  // Increment the Prometheus counter for this guide view
  guideViewCounter.inc({ slug });

  return (
    <GuidePageLayout
      title={guide.title}
      lastUpdated={guide.lastUpdated}
      checklistSteps={guide.checklist?.map(task => ({ task }))}
      headings={guide.headings}
      slug={slug}
      agency={guide.agency}
      category={guide.category}
      difficulty={guide.difficulty}
      readTime={guide.estimatedTime}
      allGuides={allGuides}
    >
      <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-1000">
        <Adsense variant="article" />
      </div>
      <article className="prose prose-sky max-w-none prose-headings:text-ctp-text prose-p:text-ctp-subtext1 prose-strong:text-ctp-text prose-li:text-ctp-subtext1 prose-table:border-ctp-surface0 prose-th:text-ctp-sky-800 prose-td:text-ctp-subtext1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          components={{
            h2: ({ ...props }) => (
              <h2 className="text-2xl font-bold text-ctp-text mt-12 mb-6 tracking-tight border-b border-ctp-surface1 pb-2" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-xl font-bold text-ctp-text mt-10 mb-4 tracking-tight" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-base text-ctp-subtext1 font-medium leading-relaxed mb-6" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-8 space-y-3 mb-6 text-ctp-subtext1" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-8 space-y-3 mb-6 text-ctp-subtext1" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="marker:text-ctp-sky-800 font-medium text-base" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <div className="my-8 bg-ctp-mantle border-l-4 border-ctp-sky-800 rounded-r-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-sm border border-ctp-surface1">
                    <Sparkles size={16} />
                  </div>
                  <div className="prose-p:mb-0 prose-p:text-ctp-text prose-p:font-semibold italic" {...props} />
                </div>
              </div>
            ),
            strong: ({ ...props }) => (
              <strong className="text-ctp-text font-bold" {...props} />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-8 rounded-xl border border-ctp-surface1">
                <table className="w-full border-collapse" {...props} />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-ctp-mantle" {...props} />
            ),
            th: ({ ...props }) => (
              <th className="px-6 py-3 text-left text-xs font-bold text-ctp-sky-800 uppercase tracking-widest border-b border-ctp-surface1" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-6 py-4 text-sm text-ctp-subtext1 border-b border-ctp-surface1 font-medium" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-ctp-base/50 transition-colors last:prose-td:border-b-0" {...props} />
            ),
            hr: ({ ...props }) => (
              <hr className="my-10 border-t border-ctp-surface1" {...props} />
            ),
          }}
        >
          {guide.content}
        </ReactMarkdown>
      </article>
    </GuidePageLayout>
  );
}
