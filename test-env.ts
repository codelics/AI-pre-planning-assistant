import dotenv from "dotenv";

const result = dotenv.config({
  path: ".env.local",
});

console.log(result);

console.log("OPENAI =", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");
console.log("PINECONE =", process.env.PINECONE_API_KEY ? "Loaded" : "Missing");
console.log("INDEX =", process.env.PINECONE_INDEX_NAME);