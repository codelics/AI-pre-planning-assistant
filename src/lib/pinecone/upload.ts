// src/lib/pinecone/upload.ts

import {
  PineconeRecord,
} from "@pinecone-database/pinecone";

import { index } from "./client";
import { createEmbedding } from "./embeddings";

import { TextChunk } from "@/lib/rag/chunk";

interface UploadChunksOptions {

  namespace?: string;

  batchSize?: number;

}

/**
 * Upload text chunks into Pinecone.
 */
export async function uploadChunks(

  chunks: TextChunk[],

  {
    namespace = "default",
    batchSize = 100,
  }: UploadChunksOptions = {}

): Promise<void> {

  //-----------------------------------
  // Nothing to upload
  //-----------------------------------

  if (!chunks.length) {

    console.log(
      "No chunks to upload."
    );

    return;

  }

  console.log(
    `Uploading ${chunks.length} chunks...`
  );

  //-----------------------------------
  // Upload in batches
  //-----------------------------------

  for (

    let i = 0;

    i < chunks.length;

    i += batchSize

  ) {

    const batch =
      chunks.slice(
        i,
        i + batchSize
      );

    //-----------------------------------
    // Generate embeddings
    //-----------------------------------

    const vectors: PineconeRecord[] =
      await Promise.all(

        batch.map(
          async (chunk) => {

            const embedding =
              await createEmbedding(
                chunk.text
              );

            return {

              id: chunk.id,

              values: embedding,

              metadata: {

                text: chunk.text,

              },

            };

          }
        )

      );

    //-----------------------------------
    // Upload batch
    //-----------------------------------

    await index
      .namespace(namespace)
      .upsert({

        records: vectors,

      });

    console.log(

      `Uploaded ${Math.min(
        i + batch.length,
        chunks.length
      )}/${chunks.length}`

    );

  }

  console.log(
    "Pinecone upload completed."
  );

}