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

export function getAllGuides() {
  const slugs = getGuideSlugs();
  const guides = slugs
    .map((slug) => getGuideBySlug(slug))
    // filter out nulls if any
    .filter(Boolean)
    // sort guides by date or title if needed
    .sort((a, b) => (a.title > b.title ? 1 : -1));
  return guides;
}

function extractHeadings(markdown) {
  const regex = /^##\s+(.*)/gm;
  const matches = [...markdown.matchAll(regex)];
  
  return matches.map((match) => {
    let text = match[1];
    
    // Create ID matching rehype-slug (github-slugger) more accurately
    // It keeps consecutive dashes if they come from different non-alphanumeric chars
    const id = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove most punctuation (like em-dash)
      .replace(/\s+/g, '-')      // Replace spaces with dashes
      .replace(/^-+|-+$/g, '');  // Trim dashes only from start/end

    // Strip leading numbers for TOC display (e.g., "1. ", "01. ", "1) ", " 1. ")
    // We only strip if it looks like a list number, preserving "Phase 1"
    const strippedText = text.replace(/^\s*(\d+[\.\)]\s*)+/, '').trim();

    return { text: strippedText, id };
  });
}
