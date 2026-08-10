import { getOpenAI } from "../openai/client";

/**
 * Creates a 1536-dimensional embedding using OpenAI.
 */
export async function createEmbedding(
  text: string
): Promise<number[]> {

  const openai = getOpenAI();

  const response =
    await openai.embeddings.create({

      model: "text-embedding-3-small",

      input: text,

    });

  return response.data[0].embedding;

}