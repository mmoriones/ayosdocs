import { streamText, embed } from 'ai';
import { aiModel, embeddingModel, qdrant, COLLECTION_NAME } from '@/lib/ai/provider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // 1. Convert user question to vector
  const { embedding } = await embed({
    model: embeddingModel,
    value: lastMessage.content,
  });

  // 2. Search Qdrant for context
  const searchResults = await qdrant.search(COLLECTION_NAME, {
    vector: embedding,
    limit: 3,
    with_payload: true,
  });

  const context = searchResults
    .map(result => `Guide: ${result.payload.guideTitle}\nSection: ${result.payload.sectionTitle}\nContent: ${result.payload.text}`)
    .join('\n\n---\n\n');

  // 3. Generate response using Claude 3 Haiku
  const result = await streamText({
    model: aiModel,
    system: `You are AyosDocs Assistant, a helpful expert on Philippine government procedures. 
    Use the provided context from official AyosDocs guides to answer the user's question.
    
    Rules:
    - Only answer based on the provided context.
    - If the answer is not in the context, politely say you don't know and suggest they check the official agency website.
    - Keep answers concise, accurate, and easy to follow.
    - Use a professional yet friendly Filipino-English (Taglish) or pure English/Tagalog depending on the user's tone.
    - Provide the guide title and a link to it if applicable (slug: /guides/[slug]).
    
    Context:
    ${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}
