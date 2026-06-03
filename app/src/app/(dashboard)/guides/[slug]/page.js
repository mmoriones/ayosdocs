import { getGuideBySlug, getGuideSlugs, getAllGuides } from '@/lib/guides';
import { notFound } from 'next/navigation';
import { guideViewCounter } from '@/lib/metrics';
import ReactMarkdown from 'react-markdown';
import GuidePageLayout from './GuidePageLayout';
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
    a: ({ ...props }) => <a className="text-[#0038A8] font-bold hover:underline" {...props} />,
    // Ensure bold text uses consistent weight
    strong: ({ children }) => <strong className="font-bold text-[#1C1C1E]">{children}</strong>
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

      <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-1000">
        <Adsense variant="article" />
      </div>

      <article>
        <div className="space-y-12">
          {guide.content.map((section, sIdx) => (
            <section key={section.id || sIdx} id={section.id} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[13px] font-black text-[#0038A8] bg-[#0038A8]/5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#0038A8]/10">
                  {sIdx + 1}
                </span>
                <h2 className="text-[20px] lg:text-[22px] font-bold text-[#1C1C1E] tracking-tight">
                  {section.title}
                </h2>
                <div className="flex-1 border-t border-gray-100/60" />
              </div>

              <div className="space-y-6">
                {section.blocks.map((block, bIdx) => (
                  <div key={bIdx}>
                    {block.type === 'paragraph' && (
                      <div className="text-[15px] lg:text-[16px] text-gray-500 font-medium leading-relaxed">
                        <ReactMarkdown components={mdComponents}>
                          {block.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {block.type === 'subheading' && (
                      <div className={`${bIdx === 0 ? 'mt-0' : 'mt-10'} mb-4`}>
                        <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1C1C1E] mb-2 tracking-tight">{block.title}</h3>
                        {block.content && (
                          <div className="text-[14px] text-gray-400 font-medium leading-relaxed">
                            <ReactMarkdown components={mdComponents}>
                              {block.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                    {block.type === 'list' && (
                      <div className={`${bIdx === 0 ? 'mt-0' : 'mt-8'} mb-6 space-y-4`}>
                        {block.title && <h4 className="text-[15px] font-bold text-[#1C1C1E] mb-2">{block.title}</h4>}
                        <ul className="space-y-3">
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex gap-4 text-[14px] lg:text-[15px] text-gray-500 font-medium leading-relaxed group">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0038A8] mt-2.5 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" />
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
                      <hr className="my-12 border-t border-gray-100/60" />
                    )}
                    {block.type === 'table' && (
                      <div className={`overflow-x-auto ${bIdx === 0 ? 'mt-0' : 'mt-8'} mb-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm`}>
                        <table className="w-full border-collapse text-left">
                          <thead>
                            <tr className="border-b border-gray-100/40">
                              {block.headers.map((header, hIdx) => (
                                <th key={hIdx} className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100/40">
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/40 transition-colors group">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-6 py-5 text-[14px] text-[#1C1C1E] font-bold leading-tight">
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
                      <div className={`rounded-[28px] p-6 border flex gap-5 transition-all hover:shadow-md ${bIdx === 0 ? 'mt-0' : 'mt-8'} mb-8 ${
                        block.variant === 'info' ? 'bg-blue-50/30 border-blue-100/50 text-blue-900' :
                        block.variant === 'warning' ? 'bg-amber-50/30 border-amber-100/50 text-amber-900' :
                        block.variant === 'note' ? 'bg-gray-50/50 border-gray-100 text-gray-700' :
                        'bg-gray-50/30 border-gray-100 text-gray-900'
                      }`}>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-white/50">
                          {block.variant === 'note' ? (
                            <Info size={20} className="text-gray-400" />
                          ) : (
                            <Sparkles size={20} className="text-[#0038A8] opacity-60" />
                          )}
                        </div>
                        <div className="text-[14px] lg:text-[15px] font-medium leading-relaxed pt-2">
                          {block.variant === 'note' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-widest mr-2 align-middle mb-0.5">Note</span>
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
