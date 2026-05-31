import { getGuideBySlug, getGuideSlugs, getAllGuides } from '@/lib/guides';
import { notFound } from 'next/navigation';
import { guideViewCounter } from '@/lib/metrics';
import ReactMarkdown from 'react-markdown';
import { GuidePageLayout } from '@/features/guides/components/reader';
import Adsense from '@/components/Adsense';
import { Sparkles, AlertCircle, Info } from 'lucide-react';
import { Banner } from '@/components/ui';
import { generateHowToSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';

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

  if (!guide || !guide.isJson) {
    notFound();
  }

  // Increment the Prometheus counter for this guide view
  guideViewCounter.inc({ slug });

  const mdComponents = {
    // Disable block-level paragraph wrappers from ReactMarkdown to maintain React layout control
    p: ({ children }) => <>{children}</>,
    // High-fidelity link styling
    a: ({ ...props }) => <a className="text-[#0038A8] font-black hover:underline" {...props} />,
    // Ensure bold text uses consistent weight
    strong: ({ children }) => <strong className="font-black text-[#1C1C1E]">{children}</strong>
  };

  const howToSchema = generateHowToSchema(guide);
  const faqSchema = generateFAQSchema(guide);
  const breadcrumbSchema = generateBreadcrumbSchema(guide);

  return (
    <GuidePageLayout
      title={guide.title}
      description={guide.description}
      lastUpdated={guide.lastUpdated}
      checklistSteps={guide.checklist}
      requirements={guide.requirements}
      fees={guide.fees}
      headings={guide.headings}
      slug={slug}
      agency={guide.agency}
      category={guide.category}
      difficulty={guide.difficulty}
      costRange={guide.costRange}
      readTime={guide.estimatedTime}
      allGuides={allGuides}
      relatedGuideSlugs={guide.relatedGuideSlugs}
    >
      {/* SEO Structured Data */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-1000">
        <Adsense variant="article" />
      </div>

      <article>
        <div className="space-y-12">
          {guide.content.map((section, sIdx) => (
            <section key={section.id || sIdx} id={section.id} className="scroll-mt-24">
              <h2 className="text-[20px] font-black text-[#1C1C1E] mb-6 tracking-tight border-b border-gray-100 pb-3 uppercase tracking-widest">
                {sIdx + 1}. {section.title}
              </h2>
              <div className="space-y-6">
                {section.blocks.map((block, bIdx) => (
                  <div key={bIdx} className="mb-6 last:mb-0">
                    {block.type === 'paragraph' && (
                      <div className="text-[15px] text-gray-600 font-medium leading-relaxed">
                        <ReactMarkdown components={mdComponents}>
                          {block.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {block.type === 'subheading' && (
                      <div className="mt-10 mb-5">
                        <h3 className="text-[18px] font-black text-[#1C1C1E] mb-3 tracking-tight">{block.title}</h3>
                        {block.content && (
                          <div className="text-[14px] text-gray-500 font-medium leading-relaxed">
                            <ReactMarkdown components={mdComponents}>
                              {block.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                    {block.type === 'list' && (
                      <div className="space-y-4 my-6">
                        {block.title && <h4 className="text-[15px] font-black text-[#1C1C1E] mb-2">{block.title}</h4>}
                        <ul className="space-y-3">
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex gap-3 text-[14px] text-gray-600 font-medium leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0038A8] mt-2 shrink-0 opacity-40" />
                              <div className="flex-1">
                                <ReactMarkdown components={mdComponents}>
                                  {item}
                                </ReactMarkdown>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {block.type === 'rule' && (
                      <hr className="my-12 border-t border-gray-100" />
                    )}
                    {block.type === 'table' && (
                      <div className="overflow-x-auto mb-10 bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] shadow-sm">
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="border-b border-gray-100/50">
                              {block.headers.map((header, hIdx) => (
                                <th key={hIdx} className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100/50">
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/40 transition-colors group">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-6 py-5 text-[14px] text-[#1C1C1E] font-black leading-tight group-last:border-b-0">
                                    <ReactMarkdown components={mdComponents}>
                                      {cell}
                                    </ReactMarkdown>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {block.type === 'banner' && (
                      <div className={`my-8 rounded-3xl p-6 border flex gap-4 ${
                        block.variant === 'info' ? 'bg-blue-50/40 border-blue-100 text-blue-900' :
                        block.variant === 'warning' ? 'bg-amber-50/40 border-amber-100 text-amber-900' :
                        block.variant === 'note' ? 'bg-gray-50 border-gray-200 text-gray-700' :
                        'bg-gray-50 border-gray-100 text-gray-900'
                      }`}>
                        {block.variant === 'note' ? (
                          <Info size={20} className="shrink-0 mt-0.5 text-gray-400" />
                        ) : (
                          <Sparkles size={20} className="shrink-0 mt-0.5 text-[#0038A8] opacity-60" />
                        )}
                        <div className="text-[14px] font-medium leading-relaxed">
                          {block.variant === 'note' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider mr-2 align-middle mb-0.5">Note</span>
                          )}
                          <ReactMarkdown components={mdComponents}>
                            {block.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-ctp-surface1">
        <Banner
          variant="orange"
          icon={AlertCircle}
          title="Legal Disclaimer"
        >
          <ReactMarkdown components={mdComponents}>
            AyosDocs is an independent information platform and is **not affiliated** with any government agency. While we strive for accuracy, government policies and fees can change. We recommend always verifying details with official government portals before proceeding.
          </ReactMarkdown>
        </Banner>
      </footer>
    </GuidePageLayout>
  );
}
