// src/lib/rag/retriever.ts

import { loadStandards, RagChunk } from "./loader";
import {
  getKnowledgeStandards,
  KnowledgeModule,
} from "../audit-planning/knowledge-router";

export interface RetrieveOptions {
  query: string;
  module: KnowledgeModule;
  topK?: number;
}

export interface RetrievedChunk extends RagChunk {
  score: number;
}

/**
 * Simple keyword-based retriever.
 *
 * Later this can be upgraded to:
 * - BM25
 * - Embeddings
 * - Hybrid Search
 */
export async function retrieveChunks({
  query,
  module,
  topK = 5,
}: RetrieveOptions): Promise<RetrievedChunk[]> {

  //-----------------------------------
  // 1. Get routed PCAOB standards
  //-----------------------------------

  const standards = getKnowledgeStandards(module);

  //-----------------------------------
  // 2. Load the standards
  //-----------------------------------

  const chunks = await loadStandards([
    ...standards,
  ]);

  //-----------------------------------
  // 3. Build keywords
  //-----------------------------------

  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  //-----------------------------------
  // 4. Score every chunk
  //-----------------------------------

  const scored: RetrievedChunk[] = chunks.map((chunk) => {

    const text = chunk.content.toLowerCase();

    let score = 0;

    for (const keyword of keywords) {

      const matches = text.match(
        new RegExp(
          escapeRegex(keyword),
          "g"
        )
      );

      score += matches?.length ?? 0;

    }

    return {
      ...chunk,
      score,
    };

  });

  //-----------------------------------
  // 5. Return the best chunks
  //-----------------------------------

  return scored
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Escape regex characters.
 */
function escapeRegex(value: string): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}