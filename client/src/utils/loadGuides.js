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
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

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
    // detect array item
    if (line.trim().startsWith('-')) {
      if (!data[currentKey]) data[currentKey] = [];
      data[currentKey].push(line.replace('-', '').trim());
      return;
    }

    const [key, ...rest] = line.split(':');

    if (!key) return;

    currentKey = key.trim();
    const value = rest.join(':').trim();

    if (value) {
      data[currentKey] = value;
    } else {
      data[currentKey] = []; // prepare for array
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
