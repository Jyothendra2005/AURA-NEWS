import { ai, withRetry } from "./BaseAgent";

export const generateImage = async (prompt: string) => {
  const cartoonPrompt = `Vibrant, high-quality 3D cartoon style illustration of: ${prompt}. Professional character design, expressive, clean lines, bright colors.`;
  
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: cartoonPrompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    }));

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Image generation failed after retries:", e);
  }
  return null;
};
