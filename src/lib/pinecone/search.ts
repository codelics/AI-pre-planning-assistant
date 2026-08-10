// src/lib/pinecone/search.ts

import { RecordMetadata } from "@pinecone-database/pinecone";

import { index } from "./client";
import { createEmbedding } from "./embeddings";

export interface SearchResult {

  id: string;

  score: number;

  text: string;

  metadata: RecordMetadata;

}

interface SearchOptions {

  namespace?: string;

  topK?: number;

}

/**
 * Search Pinecone for the most relevant PCAOB chunks.
 */
export async function searchKnowledge(

  query: string,

  {
    namespace = "",
    topK = 8,
  }: SearchOptions = {}

): Promise<SearchResult[]> {

  //-----------------------------------
  // Create query embedding
  //-----------------------------------

  const embedding =
    await createEmbedding(query);

  //-----------------------------------
  // Search Pinecone
  //-----------------------------------

  const response =
    namespace
      ? await index
          .namespace(namespace)
          .query({

            vector: embedding,

            topK,

            includeMetadata: true,

          })
      : await index.query({

          vector: embedding,

          topK,

          includeMetadata: true,

        });

  //-----------------------------------
  // Format results
  //-----------------------------------

  return response.matches.map((match) => ({

    id: match.id,

    score: match.score ?? 0,

    text:
      typeof match.metadata?.text === "string"
        ? match.metadata.text
        : "",

    metadata:
      match.metadata ?? {},

  }));

}