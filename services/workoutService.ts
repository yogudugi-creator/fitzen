import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Exercise } from "../types";

export const generateCustomWorkout = async (user: UserProfile | null, mood: string): Promise<{ title: string; exercises: Partial<Exercise>[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `As an expert fitness and yoga coach for Fitbro, create a custom 3-exercise session for a user with these stats: ${JSON.stringify(user)}. 
      The user's current request/mood: "${mood}". 
      
      Instructions:
      1. If the user mentions stress, flexibility, or relaxation, prioritize Yoga poses.
      2. If they mention energy or weight loss, prioritize high-intensity movements.
      3. Return the workout in a structured format with clear, encouraging titles.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["name", "reps", "sets"]
              }
            }
          },
          required: ["title", "exercises"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      title: data.title || "AI Custom Session",
      exercises: data.exercises || []
    };
  } catch (error) {
    console.error("AI Workout Error:", error);
    throw error;
  }
};