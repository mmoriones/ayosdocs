import { getGuideBySlug, getGuideSlugs, getAllGuides } from '@/lib/guides';
import { notFound } from 'next/navigation';
import { guideViewCounter } from '@/lib/metrics';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { GuidePageLayout } from '@/features/guides/components/reader';
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
  const allGuides = getAllGuides(true);

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
      <article>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          components={{
            h2: ({ ...props }) => (
              <h2 className="scroll-mt-24 text-xl font-bold text-ctp-text mt-12 mb-5 tracking-tight border-b border-ctp-surface1 pb-2 uppercase tracking-widest" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="scroll-mt-24 text-lg font-bold text-ctp-text mt-8 mb-4 tracking-tight" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed mb-4" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-6 space-y-2 mb-6 text-ctp-subtext1 text-sm" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-6 space-y-2 mb-6 text-ctp-subtext1 text-sm" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="marker:text-ctp-sky-800 font-medium" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <div className="my-8 bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-sm border border-ctp-surface1">
                    <Sparkles size={16} />
                  </div>
                  <div className="prose-p:mb-0 prose-p:text-ctp-text prose-p:font-bold prose-p:text-sm italic" {...props} />
                </div>
              </div>
            ),
            strong: ({ ...props }) => (
              <strong className="text-ctp-text font-bold" {...props} />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-8 rounded-lg border border-ctp-surface1 shadow-sm">
                <table className="w-full border-collapse text-sm" {...props} />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-ctp-mantle/50" {...props} />
            ),
            th: ({ ...props }) => (
              <th className="px-5 py-3 text-left text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest border-b border-ctp-surface1" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-5 py-4 text-xs text-ctp-text border-b border-ctp-surface1 font-medium last:border-b-0" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-ctp-mantle/30 transition-colors" {...props} />
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
