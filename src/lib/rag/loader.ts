// src/lib/rag/loader.ts

import fs from "fs/promises";
import path from "path";

export interface RagChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
}

const KNOWLEDGE_ROOT = path.join(
  process.cwd(),
  "src",
  "lib",
  "knowledge",
  "pcaob"
);

// Cache resolved folder names so every request doesn't re-read the directory
let folderCache: string[] | null = null;

async function getKnowledgeFolders(): Promise<string[]> {

  if (!folderCache) {

    const entries = await fs.readdir(
      KNOWLEDGE_ROOT,
      { withFileTypes: true }
    );

    folderCache = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

  }

  return folderCache;

}

/**
 * Resolves a standard code like "AS2101" to its actual
 * folder name, e.g. "AS 2101 — Audit Planning".
 */
async function resolveStandardFolder(
  standard: string
): Promise<string> {

  const folders = await getKnowledgeFolders();

  const normalizedTarget = standard
    .replace(/\s+/g, "")
    .toUpperCase();

  const match = folders.find((folder) => {

    const normalizedFolder = folder
      .split("—")[0]
      .replace(/\s+/g, "")
      .toUpperCase();

    return normalizedFolder === normalizedTarget;

  });

  if (!match) {

    throw new Error(
      `No knowledge folder found for standard "${standard}" in ${KNOWLEDGE_ROOT}`
    );

  }

  return match;

}

/**
 * Load a single PCAOB standard.
 *
 * Example:
 * src/lib/knowledge/pcaob/AS 2101 — Audit Planning/rag_chunks.jsonl
 */
export async function loadStandard(
  standard: string
): Promise<RagChunk[]> {

  const folderName =
    await resolveStandardFolder(standard);

  const filePath = path.join(
    KNOWLEDGE_ROOT,
    folderName,
    "rag_chunks.jsonl"
  );

  const file = await fs.readFile(
    filePath,
    "utf8"
  );

  return file
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));

}

/**
 * Load multiple PCAOB standards.
 */
export async function loadStandards(
  standards: string[]
): Promise<RagChunk[]> {

  const results = await Promise.all(
    standards.map(loadStandard)
  );

  return results.flat();

}