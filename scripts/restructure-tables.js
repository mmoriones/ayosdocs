const fs = require('fs');
const path = require('path');

const guidesDirectory = path.join(__dirname, '../app/src/data/guides');

/**
 * Script to refactor 'table' blocks in JSON files from Markdown strings to structured objects.
 */
function restructureTables() {
  const files = fs.readdirSync(guidesDirectory).filter(f => f.endsWith('.json'));
  console.log(`📊 Restructuring tables in ${files.length} guides...`);

  files.forEach(file => {
    const filePath = path.join(guidesDirectory, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    let modified = false;

    if (data.content) {
      data.content.forEach(section => {
        section.blocks = section.blocks.map(block => {
          if (block.type === 'table' && typeof block.content === 'string') {
            const structured = parseMarkdownTable(block.content);
            if (structured) {
              modified = true;
              return {
                type: 'table',
                headers: structured.headers,
                rows: structured.rows
              };
            }
          }
          return block;
        });
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Restructured tables in: ${file}`);
    }
  });

  console.log('✨ All tables restructured successfully!');
}

/**
 * Parses a Markdown table string into headers and rows.
 */
function parseMarkdownTable(markdown) {
  const lines = markdown.trim().split('\n').filter(l => l.includes('|') && !l.includes('|---|'));
  if (lines.length < 2) return null;

  const headers = lines[0]
    .split('|')
    .map(c => c.trim())
    .filter(Boolean)
    .map(h => h.replace(/[\*_]{1,2}/g, ''));

  const rows = lines.slice(1).map(line => {
    return line.split('|').map(c => c.trim()).filter(Boolean);
  });

  return { headers, rows };
}

restructureTables();
