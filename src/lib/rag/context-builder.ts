// src/lib/rag/context_builder.ts

import { RetrievedChunk } from "./retriever";

/**
 * Builds a GPT-ready context string from
 * the retrieved RAG chunks.
 */
export function buildContext(
  chunks: RetrievedChunk[]
): string {

  //-----------------------------------
  // No retrieved knowledge
  //-----------------------------------

  if (chunks.length === 0) {

    return "No relevant PCAOB knowledge was retrieved.";

  }

  //-----------------------------------
  // Build formatted context
  //-----------------------------------

  return chunks
    .map((chunk, index) => {

      const standard =
        chunk.metadata.standard ?? "Unknown Standard";

      const paragraph =
        chunk.metadata.paragraph ?? "Unknown Paragraph";

      const title =
        chunk.metadata.title ?? "";

      return [
        `========== Chunk ${index + 1} ==========`,

        `Standard: ${standard}`,

        `Paragraph: ${paragraph}`,

        title
          ? `Title: ${title}`
          : null,

        "",

        chunk.content,

        "",
      ]
        .filter(Boolean)
        .join("\n");

    })
    .join("\n----------------------------------------\n\n");

}