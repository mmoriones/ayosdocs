const modules = import.meta.glob('../data/guides/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const extractHeadings = (markdown) => {
  const regex = /^##\s+(.*)/gm;

  return [...markdown.matchAll(regex)].map((match) => {
    const text = match[1];

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Keep alphanumeric, spaces, and hyphens
      .trim()
      .replace(/\s+/g, "-")     // Replace spaces with hyphens
      .replace(/-+/g, "-");     // Collapse multiple hyphens

    return { text, id };
  });
};

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatter, content] = match;

  const data = {};
  let currentKey = null;

  frontmatter.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Detect array item
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
      data[key] = []; // Initialize array for subsequent items
    }
  });

  return { data, content };
};

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
