
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getHealthAdvice = async (query: string, studentContext?: string) => {
  if (!API_KEY) return "API key is missing. AI features disabled.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an intelligent School Nurse Assistant for School Health Pro. 
    Your role is to provide preliminary health guidance and medical record summaries.
    Always include a disclaimer that you are an AI and not a substitute for professional medical advice.
    Focus on student health, common childhood/adolescent ailments, and school safety protocols.
    Context provided: ${studentContext || "General school health context"}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI assistant.";
  }
};