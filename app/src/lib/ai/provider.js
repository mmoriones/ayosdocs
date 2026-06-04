import { bedrock } from '@ai-sdk/amazon-bedrock';
import { QdrantClient } from '@qdrant/js-client-rest';

/**
 * Future-proof AI Configuration
 * This file is the ONLY place that knows AWS Bedrock exists.
 * To swap providers, you only need to change this file.
 */

const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'ap-southeast-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// 1. The LLM (The Brain)
// We use the Asia-Pacific regional inference profile for Claude 3 Haiku
export const aiModel = bedrock('apac.anthropic.claude-3-haiku-20240307-v1:0', {
  bedrockOptions: AWS_CONFIG,
});

// 2. The Embedding Model (The Translator)
// We use Cohere Multilingual v3 for best-in-class Taglish and Filipino support
export const embeddingModel = bedrock.embedding('cohere.embed-multilingual-v3', {
  bedrockOptions: AWS_CONFIG,
});

// 3. The Vector Database (The Memory)
export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
});

export const COLLECTION_NAME = 'ayosdocs_guides';
