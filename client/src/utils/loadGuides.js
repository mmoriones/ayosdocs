const modules = import.meta.glob('../data/guides/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

/**
 * Extracts headings from a markdown string and generates slugs for them.
 * 
 * @param {string} markdown - The raw markdown content.
 * @returns {Array<{text: string, id: string}>} An array of heading objects with text and id.
 */
const extractHeadings = (markdown) => {
  // A global regex finds all H2 headings (##).
  // The 'm' flag allows '^' to match the start of each line within the string.
  const regex = /^##\s+(.*)/gm;

  return [...markdown.matchAll(regex)].map((match) => {
    const text = match[1];

    // Generation of a "slug" from the heading text for anchor links.
    // Special characters are removed and spaces are replaced with hyphens.
    // This process makes the ID safe for use in URLs and HTML attributes.
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Keep alphanumeric, spaces, and hyphens
      .trim()
      .replace(/\s+/g, "-")     // Replace spaces with hyphens
      .replace(/-+/g, "-");     // Collapse multiple hyphens

    return { text, id };
  });
};

/**
 * Parses YAML-like frontmatter from a markdown string.
 * 
 * @param {string} raw - The raw markdown file content.
 * @returns {{data: Object, content: string}} An object containing the parsed metadata and the remaining content.
 */
const parseFrontmatter = (raw) => {
  // Frontmatter is the metadata block at the top of the file, delimited by '---'.
  // This regex separates the metadata block from the markdown content.
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    // Return the original string as content if no frontmatter is found.
    return { data: {}, content: raw };
  }

  const [, frontmatter, content] = match;

  const data = {};
  let currentKey = null;

  // Manual parsing of frontmatter lines avoids including a heavy YAML library.
  // This optimization keeps the client-side bundle size small.
  frontmatter.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Handle array items (lines starting with '-')
    if (trimmedLine.startsWith('-')) {
      if (currentKey && Array.isArray(data[currentKey])) {
        data[currentKey].push(trimmedLine.replace(/^-/, '').trim());
      }
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    currentKey = key;
    
    if (value) {
      data[key] = value;
    } else {
      // Initialization of an empty array for a key if no value follows the colon.
      // Subsequent lines starting with '-' will populate this array.
      data[key] = []; 
    }
  });

  return { data, content };
};

/**
 * A map of guide slugs to their processed content and metadata.
 * Dynamically loaded from markdown files in `../data/guides/`.
 * 
 * @type {Object.<string, {
 *   slug: string,
 *   content: string,
 *   headings: Array<{text: string, id: string}>,
 *   [key: string]: any
 * }>}
 */
export const guidesMap = Object.entries(modules).reduce(
  (acc, [path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '');

    const { data, content } = parseFrontmatter(raw);

    acc[slug] = {
      ...data,
      slug,
      content,
      headings: extractHeadings(content),
    };

    return acc;
  },
  {}
);
