// scripts/upload-pcaob.ts

import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import fs from "fs";
import path from "path";

import { PineconeRecord } from "@pinecone-database/pinecone";

import { createEmbedding } from "../src/lib/pinecone/embeddings";
import { index } from "../src/lib/pinecone/client";

interface Chunk {
  id: string;
  content: string;

  metadata: {
    document: string | null;
    standard: string | null;
    paragraph: string | null;
    section: string | null;
    chunk: number | null;
    is_footnote: boolean | null;
    effective_date: string | null;
  };
}

const KNOWLEDGE_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "knowledge",
  "pcaob"
);

async function uploadFolder(folder: string) {

  const filePath = path.join(
    KNOWLEDGE_PATH,
    folder,
    "rag_chunks.jsonl"
  );

  if (!fs.existsSync(filePath)) {

    console.log(`Skipping ${folder} (no rag_chunks.jsonl)`);

    return;

  }

  console.log(`\nUploading ${folder}`);

  const lines = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .filter(Boolean);

  const vectors: PineconeRecord[] = [];

  for (const line of lines) {

    const chunk: Chunk =
      JSON.parse(line);

    const embedding =
      await createEmbedding(chunk.content);

    vectors.push({

      id: chunk.id,

      values: embedding,

      metadata: {

        text:
          chunk.content,

        document:
          chunk.metadata.document ?? "",

        standard:
          chunk.metadata.standard ?? "",

        section:
          chunk.metadata.section ?? "",

        paragraph:
          chunk.metadata.paragraph ?? "",

        chunk:
          chunk.metadata.chunk ?? 0,

        is_footnote:
          chunk.metadata.is_footnote ?? false,

        effective_date:
          chunk.metadata.effective_date ?? "",

      },

    });

    console.log(`Embedded ${chunk.id}`);

    //----------------------------------
    // Upload every 100 vectors
    //----------------------------------

    if (vectors.length === 100) {

      await index.upsert({

        records: vectors,

      });

      console.log(
        `Uploaded ${vectors.length} vectors`
      );

      vectors.length = 0;

    }

  }

  //----------------------------------
  // Upload remaining vectors
  //----------------------------------

  if (vectors.length > 0) {

    await index.upsert({

      records: vectors,

    });

    console.log(
      `Uploaded ${vectors.length} vectors`
    );

  }

}

async function main() {

  console.log("Loading PCAOB knowledge...");

  console.log(
    "OpenAI Key:",
    process.env.OPENAI_API_KEY
      ? "Loaded"
      : "Missing"
  );

  console.log(
    "Pinecone Key:",
    process.env.PINECONE_API_KEY
      ? "Loaded"
      : "Missing"
  );

  console.log(
    "Index:",
    process.env.PINECONE_INDEX_NAME
  );

  const folders =
    fs.readdirSync(KNOWLEDGE_PATH);

  console.log(
    `Found ${folders.length} PCAOB folders`
  );

  for (const folder of folders) {

    const stat =
      fs.statSync(
        path.join(KNOWLEDGE_PATH, folder)
      );

    if (!stat.isDirectory()) {
      continue;
    }

    await uploadFolder(folder);

  }

  console.log("\nFinished uploading.");

}

main().catch(console.error);