import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const guidesDirectory = path.join(process.cwd(), 'src/data/guides');

export function getGuideSlugs() {
  return fs.readdirSync(guidesDirectory).map(file => file.replace(/\.md$/, ''));
}

export function getGuideBySlug(slug) {
  const fullPath = path.join(guidesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const headings = extractHeadings(content);

  // Ensure lastUpdated is a string
  const lastUpdated = data.lastUpdated instanceof Date 
    ? data.lastUpdated.toISOString().split('T')[0] 
    : data.lastUpdated;

  return {
    slug,
    ...data,
    lastUpdated,
    content,
    headings,
  };
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
