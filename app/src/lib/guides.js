import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const guidesDirectory = path.join(process.cwd(), 'src/data/guides');

export function getGuideBySlug(slug) {
  const jsonPath = path.join(guidesDirectory, `${slug}.json`);
  const mdPath = path.join(guidesDirectory, `${slug}.md`);

  // 1. Check for JSON first (New Standard)
  if (fs.existsSync(jsonPath)) {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Extract headings from the structured content blocks
    const headings = data.content?.map(section => ({
      text: section.title,
      id: section.id || section.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    })) || [];

    return {
      ...data,
      isJson: true,
      headings
    };
  }

  // 2. Fallback to Markdown
  if (!fs.existsSync(mdPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(mdPath, 'utf8');
  const { data, content } = matter(fileContents);
  const headings = extractHeadings(content);

  const lastUpdated = data.lastUpdated instanceof Date 
    ? data.lastUpdated.toISOString().split('T')[0] 
    : data.lastUpdated;

  return {
    slug,
    ...data,
    lastUpdated,
    content,
    headings,
    isJson: false
  };
}

export function getGuideSlugs() {
  const files = fs.readdirSync(guidesDirectory);
  // Get unique slugs by removing extensions and filtering
  const slugs = files
    .filter(file => file.endsWith('.json') || file.endsWith('.md'))
    .map(file => file.replace(/\.(json|md)$/, ''));
  
  return [...new Set(slugs)];
}

export function getAllGuides(summary = false) {
  const slugs = getGuideSlugs();
  const guides = slugs
    .map((slug) => getGuideBySlug(slug))
    // filter out nulls if any
    .filter(Boolean)
    // if summary is true, remove the full content to save memory/payload size
    .map((guide) => {
      if (summary) {
        const { content, ...rest } = guide;
        return rest;
      }
      return guide;
    })
    // sort guides by date or title if needed
    .sort((a, b) => (a.title > b.title ? 1 : -1));
  return guides;
}

function extractHeadings(markdown) {
  // Matches both ## and ### if needed, but we'll stick to ## for now as per current design
  const regex = /^##\s+(.*)/gm;
  const matches = [...markdown.matchAll(regex)];
  
  return matches.map((match) => {
    const text = match[1].trim();
    
    // Improved slugify logic to match rehype-slug (github-slugger)
    const id = text
      .toLowerCase()
      .replace(/<[^>]+>/g, '') // Remove HTML tags if any
      .replace(/[^\w\s-]/g, '') // Remove punctuation
      .replace(/\s+/g, '-')      // Replace spaces with dashes
      .replace(/-+/g, '-')      // Replace multiple dashes with single
      .trim();

    // Strip leading numbers for display in the TOC list
    const strippedText = text.replace(/^(\d+[\.\)]\s*)+/, '').trim();

    return { text: strippedText, id };
  });
}
