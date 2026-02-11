
import { GoogleGenAI } from "@google/genai";

export interface PlaceResult {
  title: string;
  uri: string;
}

export const findNearbyFitness = async (lat: number, lng: number): Promise<{ text: string; links: PlaceResult[] }> => {
  try {
    // ALWAYS use process.env.API_KEY directly without fallbacks or modifications.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      // Use the correct full model name for Gemini Lite.
      model: "gemini-flash-lite-latest",
      contents: "List 5 highly-rated gyms, yoga studios, or healthy cafes near my current location. Provide a brief sentence for why each is a good choice for a fitness enthusiast.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const links: PlaceResult[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.maps) {
        links.push({
          title: chunk.maps.title || "View on Maps",
          uri: chunk.maps.uri
        });
      }
    });

    return {
      text: response.text || "Found some great spots near you!",
      links: links
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return {
      text: "I couldn't access local map data right now. Please check your location settings!",
      links: []
    };
  }
};
