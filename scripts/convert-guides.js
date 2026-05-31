const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const guidesDirectory = path.join(__dirname, '../app/src/data/guides');

/**
 * Robust script to convert AyosDocs Markdown guides to structured Block-Based JSON.
 */
function convertAll() {
  const files = fs.readdirSync(guidesDirectory).filter(f => f.endsWith('.md'));
  console.log(`🚀 Starting conversion of ${files.length} guides...`);

  files.forEach(file => {
    const filePath = path.join(guidesDirectory, file);
    const slug = file.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { data, content } = matter(fileContents);
      
      // Clean up requirements and checklist data from frontmatter
      if (data.requirements) {
        data.requirements = data.requirements.map(r => ({
          ...r,
          title: r.title.replace(/[\*_]{1,2}/g, '').trim(),
          description: r.description.replace(/[\*_]{1,2}/g, '').trim()
        }));
      }
      if (data.checklist) {
        data.checklist = data.checklist.map(c => ({
          ...c,
          title: c.title.replace(/[\*_]{1,2}/g, '').trim(),
          description: c.description.replace(/[\*_]{1,2}/g, '').trim()
        }));
      }

      let structuredContent = segmentBody(content);
      
      // Extract structured fees from the "Fees" section
      let fees = [];
      const feesSectionIndex = structuredContent.findIndex(s => s.title.toLowerCase().includes('fees'));
      if (feesSectionIndex !== -1) {
        const feesSection = structuredContent[feesSectionIndex];
        const tableBlock = feesSection.blocks.find(b => b.type === 'table');
        if (tableBlock) {
          fees = parseFeesTable(tableBlock.content);
          // Remove the section from content to avoid redundancy in the UI
          structuredContent.splice(feesSectionIndex, 1);
        }
      }

      const jsonOutput = {
        id: slug,
        ...data,
        slug,
        lastUpdated: data.lastUpdated instanceof Date 
          ? data.lastUpdated.toISOString().split('T')[0] 
          : data.lastUpdated,
        fees,
        content: structuredContent,
      };

      const outPath = path.join(guidesDirectory, `${slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(jsonOutput, null, 2));
      console.log(`✅ Converted: ${slug}`);
    } catch (err) {
      console.error(`❌ Failed to convert ${slug}:`, err.message);
    }
  });
  
  console.log('✨ All guides converted successfully!');
}

/**
 * Splits the Markdown body into sections based on Level 2 headings.
 */
function segmentBody(markdown) {
  // Regex to split by ## headings, keeping the heading in the result
  const sections = markdown.split(/(?=^##\s+)/m);

  return sections
    .map(section => {
      const lines = section.trim().split('\n');
      if (lines.length === 0 || !lines[0].startsWith('##')) return null;

      const titleLine = lines[0].replace(/^##\s+/, '').trim();

      // If the heading itself is just a rule like "## ---", ignore it
      if (titleLine === '---' || titleLine === '***') return null;

      // DEEP CLEAN: Remove leading numbers AND "Step X", "Phase X" prefixes
      const cleanTitle = titleLine
        .replace(/^(\d+[\.\)]\s*)+/, '') // Remove "1. ", "1.1 "
        .replace(/^(Step|Phase|Part)\s+\d+[\s:–-]*/gi, '') // Remove "Step 1: ", "Phase 2 - "
        .trim();
      const bodyContent = lines.slice(1).join('\n').trim();
      const blocks = identifyBlocks(bodyContent);

      if (blocks.length === 0) return null;

      return {
        id: cleanTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        title: cleanTitle,
        blocks
      };
    })
    .filter(Boolean);
}

/**
 * Identifies different block types within a section's body.
 */
function identifyBlocks(markdown) {
  if (!markdown) return [];

  // Pre-process: ensure lines starting with markers are separated by double newlines
  // This handles cases where notes or subheadings follow text with only a single newline
  const prepared = markdown.replace(/\n(💡|>|Note:|\*\*Note:?\*\*|###)/gi, '\n\n$1');

  const blocks = [];
  const parts = prepared.split(/\n\n+/);

  parts.forEach(part => {
    let trimmed = part.trim();
    if (!trimmed) return;

    // 1. Horizontal Rule Detection & Removal
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') return;

    // 2. Table Detection
    if (trimmed.includes('|---|') || (trimmed.startsWith('|') && trimmed.includes('\n|'))) {
      blocks.push({ type: 'table', content: trimmed });
    }
    // 3. Subheading Detection (###)
    else if (trimmed.startsWith('### ')) {
      const lines = trimmed.split('\n');
      const title = lines[0]
        .replace(/^###\s+/, '')
        .replace(/^(Step|Phase|Part)\s+\d+[\s:–-]*/gi, '')
        .trim();

      const content = lines.slice(1).join('\n').trim();
      const cleanContent = content.replace(/^---\s*|\s*---$/g, '').replace(/^---\n/, '').trim();

      blocks.push({ 
        type: 'subheading', 
        title,
        content: cleanContent || null
      });
    }
    // 4. Banner / Tip / Note Detection
    else if (
      trimmed.startsWith('💡') || 
      trimmed.startsWith('> ') || 
      /^(Note|\*\*Note:?\*\*|Tip|\*\*Tip:?\*\*):/i.test(trimmed)
    ) {
      const isExplicitNote = /^(Note|\*\*Note:?\*\*):/i.test(trimmed);
      const isEmojiInfo = trimmed.startsWith('💡');

      const variant = isEmojiInfo ? 'info' : (isExplicitNote ? 'note' : 'warning');

      // Clean up the prefix
      const content = trimmed
        .replace(/^(💡|>)\s*/, '')
        .replace(/^(Note|\*\*Note:?\*\*|Tip|\*\*Tip:?\*\*):?\s*/i, '')
        .trim();

      const cleanContent = content.replace(/^---\s*|\s*---$/g, '').trim();

      if (cleanContent) {
        blocks.push({ 
          type: 'banner', 
          variant,
          content: cleanContent
        });
      }
    }

    // 5. List Detection (ul/ol)

    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n')
        .map(li => li.replace(/^([\*\-\+]|\d+\.)\s+/, '').trim())
        .filter(li => li && li !== '---'); // Remove rule artifacts from lists

      if (items.length > 0) {
        blocks.push({ type: 'list', items });
      }
    }
    // 6. Default to Paragraph
    else {
      // Deep clean rules from paragraphs
      let cleanContent = trimmed.replace(/^---\s*|\s*---$/g, '').trim();
      
      // Centralize Cleanup: Remove manual disclaimers (handled by page.js)
      if (cleanContent.toLowerCase().includes('disclaimer') && cleanContent.toLowerCase().includes('not affiliated')) {
        return;
      }

      if (cleanContent && cleanContent !== '---') {
        blocks.push({ type: 'paragraph', content: cleanContent });
      }
    }
  });

  return blocks;
}


/**
 * Parses a Markdown table into a structured array of label/amount objects.
 */
function parseFeesTable(markdown) {
  const lines = markdown.split('\n').filter(l => l.includes('|') && !l.includes('|---|'));
  // Skip header if it exists
  const startIndex = (lines[0] && (lines[0].toLowerCase().includes('item') || lines[0].toLowerCase().includes('fee'))) ? 1 : 0;
  
  return lines.slice(startIndex)
    .map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 2) return null;
      return {
        // Strip Markdown bold/italic from labels and amounts
        label: cells[0].replace(/[\*_]{1,2}/g, ''),
        amount: cells[1].replace(/[\*_]{1,2}/g, '')
      };
    })
    .filter(Boolean);
}

convertAll();
