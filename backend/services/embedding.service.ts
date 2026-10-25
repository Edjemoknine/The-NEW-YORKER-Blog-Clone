import {
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

let extractorPromise: Promise<FeatureExtractionPipeline> | undefined;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL);
  }

  return extractorPromise;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error("Cannot generate an embedding for empty text");
  }

  const extractor = await getExtractor();

  const output = await extractor(normalizedText, {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(output.data);

  if (embedding.length !== 384) {
    throw new Error(`Expected 384 dimensions, received ${embedding.length}`);
  }

  return embedding;
}
