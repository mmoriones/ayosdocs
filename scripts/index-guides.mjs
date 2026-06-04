/**
 * Guide Ingestion Script
 * 
 * This script:
 * 1. Reads all guide JSON files from app/src/data/guides
 * 2. Generates embeddings using AWS Bedrock Titan
 * 3. Stores them in the local Qdrant instance
 */

import fs from 'fs';
import path from 'path';
import { embedMany } from 'ai';
import { embeddingModel, qdrant, COLLECTION_NAME } from '../app/src/lib/ai/provider.js';
import dotenv from 'dotenv';

// Load env from the app directory (supports both local and prod structures)
dotenv.config({ path: path.join(process.cwd(), 'app/.env.local') });
dotenv.config({ path: path.join(process.cwd(), 'app/.env') });

const GUIDES_DIR = path.join(process.cwd(), 'app/src/data/guides');

async function main() {
  console.log('🚀 Starting Guide Ingestion...');

  try {
    // 1. Ensure Collection Exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      console.log(`📦 Creating collection: ${COLLECTION_NAME}...`);
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1024, // Cohere v3 standard size
          distance: 'Cosine',
        },
      });
    }

    // 2. Read Guide Files
    const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.json'));
    console.log(`📄 Found ${files.length} guides.`);

    const documents = [];

    for (const file of files) {
      const filePath = path.join(GUIDES_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // We chunk by section to provide more granular search results
      if (content.content && Array.isArray(content.content)) {
        content.content.forEach((section, index) => {
          // Combine all blocks into a single string for embedding
          const sectionText = section.blocks
            .map(block => block.content)
            .join(' ');
          
          const fullText = `${content.title} - ${section.title}: ${sectionText}`;

          documents.push({
            id: `${content.id}-${index}`,
            text: fullText,
            metadata: {
              guideId: content.id,
              guideTitle: content.title,
              sectionTitle: section.title,
              slug: content.slug,
              category: content.category,
            }
          });
        });
      }
    }

    console.log(`🧠 Generating embeddings for ${documents.length} sections...`);

    // 3. Generate Embeddings in batches
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: documents.map(doc => doc.text),
      // Cohere specific: inputType is required for best results
      // 'search_document' for the knowledge base, 'search_query' for the user question
      inputType: 'search_document',
    });

    // 4. Upsert to Qdrant
    console.log('📤 Upserting to Qdrant...');
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: documents.map((doc, i) => ({
        id: i, // Simple increment for now, or hash of doc.id
        vector: embeddings[i],
        payload: {
          ...doc.metadata,
          text: doc.text,
        },
      })),
    });

    console.log('✅ Ingestion Complete!');
  } catch (error) {
    console.error('❌ Ingestion Failed:', error);
    process.exit(1);
  }
}

main();
