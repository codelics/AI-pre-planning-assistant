// src/lib/audit-planning/context-builder.ts

import { RetrievedChunk } from "../rag/retriever";

/**
 * Converts retrieved PCAOB knowledge into
 * a prompt-friendly text block.
 */
export function buildKnowledgeContext(
  chunks: RetrievedChunk[]
): string {

  if (chunks.length === 0) {
    return "No relevant PCAOB guidance was retrieved.";
  }

  const sections = chunks.map((chunk, index) => {

    const metadata = chunk.metadata as {
      standard?: string;
      document?: string;
      section?: string;
      paragraph?: string;
    };

    const standard =
      metadata.standard ??
      metadata.document ??
      "Unknown Standard";

    const section =
      metadata.section ??
      "Unknown Section";

    const paragraph =
      metadata.paragraph ??
      "N/A";

    return `
==================================================
Knowledge ${index + 1}

Standard:
${standard}

Section:
${section}

Paragraph:
${paragraph}

Content:
${chunk.content.trim()}
`;
  });

  return `
================ PCAOB KNOWLEDGE ================

${sections.join("\n")}

============== END PCAOB KNOWLEDGE ==============
`.trim();
}