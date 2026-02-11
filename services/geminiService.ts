import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

export const getFitnessTip = async (userProfile: UserProfile | null) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = userProfile 
      ? `As a professional fitness coach for the app Fitbro, provide a short, 2-sentence motivational tip for a ${userProfile.age}-year-old ${userProfile.gender} with a goal of ${userProfile.goal}. Keep it punchy, modern, and high-energy.`
      : "As a professional fitness coach for Fitbro, provide a short, motivational fitness tip to start the day.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Consistency is the key. Every rep counts towards your vision.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The only bad workout is the one that didn't happen. Let's get moving!";
  }
};