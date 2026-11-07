import { InferenceClient } from "@huggingface/inference";

/* const MODEL = "perplexity-ai/pplx-embed-v2-late-0.6b";
 */
const MODEL = "intfloat/multilingual-e5-small";
const hf = new InferenceClient(process.env.HF_TOKEN);

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.trim();

  if (!input) {
    throw new Error("Cannot generate an embedding for empty text");
  }

  const output = await hf.featureExtraction({
    model: MODEL,
    inputs: input,
  });
  const embedding =
    output.length === 1 && Array.isArray(output[0]) ? output[0] : output;

  if (
    embedding.length !== 384 ||
    !embedding.every((value): value is number => typeof value === "number")
  ) {
    throw new Error(
      "Hugging Face Inference did not return a 384-dimensional embedding",
    );
  }

  const magnitude = Math.hypot(...embedding);
  return embedding.map((value) => value / magnitude);
}
