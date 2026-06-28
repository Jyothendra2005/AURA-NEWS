import { ai, withRetry, FALLBACK_MODEL, Type, safeJsonParse } from "./BaseAgent";

export const generateBriefingStream = async (
  persona: string, 
  topic: string, 
  onChunk: (chunk: string) => void,
  onSources?: (sources: { title: string, url: string }[]) => void
) => {
  const isUrl = topic.trim().startsWith('http://') || topic.trim().startsWith('https://');
  
  const systemInstruction = `You are a world-class business intelligence analyst. 
  Create a personalized news briefing for a ${persona}. 
  Synthesize multiple perspectives and provide actionable insights. 
  Format the output in Markdown with clear headings and bullet points.
  
  INTERACTIVE FEATURE: 
  Identify 3-5 key business terms, companies, or people mentioned in the briefing.
  Wrap them in a Markdown link format like this: [Term](entity:Term).
  Example: "The recent [NVIDIA](entity:NVIDIA) earnings report..."
  Only link the first occurrence of each major entity.`;

  const config: any = { systemInstruction };
  if (isUrl) {
    config.tools = [{ urlContext: {} }];
  } else {
    config.tools = [{ googleSearch: {} }];
  }

  const response = await withRetry((model) => ai.models.generateContentStream({
    model,
    contents: isUrl 
      ? `Analyze and summarize the content at this URL: ${topic}. Provide insights relevant to a ${persona}.` 
      : `Provide a deep briefing on: ${topic}`,
    config,
  }));

  for await (const chunk of response) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
    
    if (onSources && chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const sources = chunk.candidates[0].groundingMetadata.groundingChunks
        .map((c: any) => ({
          title: c.web?.title,
          url: c.web?.uri
        }))
        .filter((s: any) => s.title && s.url);
      
      if (sources.length > 0) {
        onSources(sources);
      }
    }
  }
};

export const generatePersonalizedFeed = async (persona: string, interests: string[]) => {
  const prompt = `Generate 3 important business news headlines and short summaries (2 sentences each) for a ${persona} interested in: ${interests.join(', ')}.`;
  
  const response = await withRetry((model) => ai.models.generateContent({
    model: model,
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "The headline of the news article" },
            summary: { type: Type.STRING, description: "A two-sentence summary of the news article" }
          },
          required: ["headline", "summary"]
        }
      }
    },
  }));

  const text = response.text || "[]";
  const parsed = safeJsonParse(text, []);
  if (Array.isArray(parsed)) {
    return parsed.map((item: any) => {
      const headline = (item?.headline || "").trim();
      const summary = (item?.summary || "").trim();
      return `${headline}: ${summary}`;
    });
  }
  return [];
};

export const translateNews = async (text: string, targetLanguage: string) => {
  const response = await withRetry((model) => ai.models.generateContent({
    model: FALLBACK_MODEL,
    contents: `Translate the following business news into ${targetLanguage}. 
    Provide a culturally adapted explanation with local context, not just a literal translation: ${text}`,
  }));

  return response.text;
};

export const getEntityDetails = async (entity: string) => {
  const response = await withRetry((model) => ai.models.generateContent({
    model: FALLBACK_MODEL,
    contents: `Provide a concise, high-level business summary of "${entity}". 
    Include its current market position, recent major news, and why it's important in the current business landscape.
    Format the response in Markdown.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  }));

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      url: chunk.web?.uri
    })).filter((s: any) => s.title && s.url) || []
  };
};
