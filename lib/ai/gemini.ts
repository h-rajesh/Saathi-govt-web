import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({ apiKey });
}

export const gemini = new Proxy({} as any, {
  get(_, prop) {
    const client = getGeminiClient();
    return (client as any)[prop];
  },
});

export async function generateAIContent(params: {
  contents: any[];
  model?: string;
}) {
  const client = getGeminiClient();
  const preferredModel = params.model || "gemini-2.5-flash";
  const fallbackModels = [
    preferredModel,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest",
  ];

  const uniqueModels = Array.from(new Set(fallbackModels));
  let lastError: any = null;

  for (const modelName of uniqueModels) {
    try {
      const res = await client.models.generateContent({
        model: modelName,
        contents: params.contents,
      });

      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`⚠️ Gemini model '${modelName}' call failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(`AI generation failed: ${lastError?.message || "All Gemini models failed."}`);
}