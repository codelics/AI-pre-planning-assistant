import {
  Pinecone,
  RecordMetadata,
} from "@pinecone-database/pinecone";

console.log("=== Pinecone Client Loaded ===");
console.log("API KEY:", process.env.PINECONE_API_KEY);
console.log("INDEX:", process.env.PINECONE_INDEX_NAME);

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index<RecordMetadata>(
  process.env.PINECONE_INDEX_NAME!
);