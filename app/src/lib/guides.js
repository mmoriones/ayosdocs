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
    const text = match[1];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    return { text, id };
  });
}
