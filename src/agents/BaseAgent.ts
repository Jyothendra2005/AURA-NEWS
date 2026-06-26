import { GoogleGenAI, Type, Modality } from "@google/genai";

// Robust API key detection for both local and cloud environments
const getApiKey = () => {
  // 1. Try process.env.GEMINI_API_KEY (replaced by Vite's define block)
  try {
    const key = process.env.GEMINI_API_KEY;
    if (key) return key;
  } catch (e) {}
  
  // 2. Check for VITE_ prefixed key (standard Vite way for local .env)
  const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (viteKey) {
    return viteKey;
  }

  return "";
};

const apiKey = getApiKey();

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is missing. Please ensure it is set in your .env file as GEMINI_API_KEY or VITE_GEMINI_API_KEY.");
}

export const ai = new GoogleGenAI({ apiKey });

export const PRIMARY_MODEL: string = "gemini-3.1-pro-preview";
export const FALLBACK_MODEL: string = "gemini-3.5-flash";

export const withRetry = async <T>(fn: (model: string) => Promise<T>, maxRetries = 7): Promise<T> => {
  let lastError: any;
  let currentModel = PRIMARY_MODEL;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn(currentModel);
    } catch (error: any) {
      lastError = error;
      const errorStr = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
      
      // If the primary model fails for ANY reason, instantly fall back to the fallback model
      if (currentModel === PRIMARY_MODEL && PRIMARY_MODEL !== FALLBACK_MODEL) {
        currentModel = FALLBACK_MODEL;
        console.warn(`Error on ${PRIMARY_MODEL}, falling back to ${FALLBACK_MODEL}. Error:`, errorStr);
        continue;
      }

      // Handle transient errors and quota limits for the active model with exponential backoff
      const isTransient = errorStr.includes('429') || 
                          errorStr.includes('RESOURCE_EXHAUSTED') || 
                          errorStr.includes('500') || 
                          errorStr.includes('503') || 
                          errorStr.includes('xhr error');
      
      if (isTransient && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.log(`Transient error on ${currentModel}. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error(`Gemini API Error (${currentModel}):`, errorStr);
      throw error;
    }
  }
  throw lastError;
};

export const safeJsonParse = (text: string, fallback: any = null): any => {
  if (!text) return fallback;
  let cleaned = text.trim();

  // Try parsing directly first
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  // If direct parsing fails, extract JSON block based on brackets
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  let startIdx = -1;
  let endIdx = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleaned.lastIndexOf(']');
  }
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const extracted = cleaned.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(extracted);
    } catch (e) {
      console.error("Failed to parse extracted JSON block:", extracted, e);
    }
  }

  // Fallback to removing markdown blocks manually
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("All JSON parsing strategies failed for text:", text, e);
  }

  return fallback;
};

export { Type, Modality };
