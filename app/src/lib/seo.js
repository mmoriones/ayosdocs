/**
 * Utility to generate JSON-LD structured data for Google SEO and AI engines.
 */

/**
 * Generates a 'HowTo' JSON-LD object based on the guide's checklist steps.
 * @param {Object} guide - The structured guide data.
 */
export function generateHowToSchema(guide) {
  if (!guide.checklist || guide.checklist.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": guide.title,
    "description": guide.description,
    "image": `https://ayosdocs.com/api/og/guide?slug=${guide.slug}`,
    "estimatedCost": guide.fees?.length > 0 ? {
      "@type": "MonetaryAmount",
      "currency": "PHP",
      "value": guide.fees[0].amount.replace(/[^\d]/g, '') || "0"
    } : undefined,
    "totalTime": `P${guide.estimatedTime || '1D'}`,
    "step": guide.checklist.map((step, index) => ({
      "@type": "HowToStep",
      "url": `https://ayosdocs.com/guides/${guide.slug}#tracker`,
      "name": step.title,
      "itemListElement": [{
        "@type": "HowToDirection",
        "text": step.description
      }],
      "position": index + 1
    }))
  };
}

/**
 * Generates an 'FAQPage' JSON-LD object based on the guide's FAQ content blocks.
 * @param {Object} guide - The structured guide data.
 */
export function generateFAQSchema(guide) {
  const faqSection = guide.content?.find(s => 
    s.title.toLowerCase().includes('faq') || 
    s.title.toLowerCase().includes('frequently asked questions')
  );

  if (!faqSection) return null;

  const questions = faqSection.blocks
    .filter(b => b.type === 'subheading')
    .map(b => ({
      "@type": "Question",
      "name": b.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": b.content || ""
      }
    }));

  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions
  };
}

/**
 * Generates a BreadcrumbList JSON-LD object.
 */
export function generateBreadcrumbSchema(guide) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ayosdocs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": "https://ayosdocs.com/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": guide.title,
        "item": `https://ayosdocs.com/guides/${guide.slug}`
      }
    ]
  };
}
