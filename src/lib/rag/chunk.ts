// src/lib/rag/chunk.ts

export interface TextChunk {

  id: string;

  text: string;

}

export interface ChunkOptions {

  /**
   * Maximum characters per chunk.
   */
  chunkSize?: number;

  /**
   * Characters to overlap between chunks.
   */
  overlap?: number;

}

/**
 * Split large text into overlapping chunks.
 */
export function chunkText(

  text: string,

  {
    chunkSize = 1000,
    overlap = 200,
  }: ChunkOptions = {}

): TextChunk[] {

  //-----------------------------------
  // Normalize whitespace
  //-----------------------------------

  const normalized =
    text
      .replace(/\r/g, "")
      .replace(/\n+/g, "\n")
      .trim();

  //-----------------------------------
  // Empty document
  //-----------------------------------

  if (!normalized.length) {

    return [];

  }

  //-----------------------------------
  // Chunking
  //-----------------------------------

  const chunks: TextChunk[] = [];

  let start = 0;

  let index = 0;

  while (start < normalized.length) {

    let end =
      Math.min(
        start + chunkSize,
        normalized.length
      );

    //-----------------------------------
    // Try not to cut sentences
    //-----------------------------------

    if (end < normalized.length) {

      const period =
        normalized.lastIndexOf(".", end);

      const newline =
        normalized.lastIndexOf("\n", end);

      const split =
        Math.max(period, newline);

      if (split > start + 300) {

        end = split + 1;

      }

    }

    const chunk =
      normalized
        .slice(start, end)
        .trim();

    chunks.push({

      id: `chunk-${index + 1}`,

      text: chunk,

    });

    index++;

    start =
      Math.max(
        end - overlap,
        start + 1
      );

  }

  return chunks;

}