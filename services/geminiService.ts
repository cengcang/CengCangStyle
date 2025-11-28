import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from '../constants';
import { cleanBase64, getMimeType } from '../utils/imageUtils';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image of clothing based on a text prompt using NanoBanana.
 */
export const generateClothingFromText = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `Create a high-quality, professional product photo of: ${prompt}. 
    Style: Isolated on a pure white background, ghost mannequin or flat lay style, studio lighting. High resolution.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: fullPrompt }]
      },
    });

    // Extract image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Clothing Generation Error:", error);
    throw error;
  }
};

/**
 * Performs the Virtual Try-On (VTO) by combining person and clothes.
 */
export const generateTryOnResult = async (personImageBase64: string, clothingImageBase64: string): Promise<string> => {
  try {
    const mimePerson = getMimeType(personImageBase64);
    const dataPerson = cleanBase64(personImageBase64);
    
    const mimeClothes = getMimeType(clothingImageBase64);
    const dataClothes = cleanBase64(clothingImageBase64);

    // More structured prompt for the model to understand the distinct roles of the images
    const prompt = `Task: Virtual Try-On / Outfit Swap.
    
    Input Images:
    1. First Image: The user (Person).
    2. Second Image: The clothing item (Garment).

    Instructions:
    - Generate a photorealistic image of the person from the first image wearing the garment from the second image.
    - Maintain the person's exact facial identity, body shape, and pose.
    - The garment should fit naturally on the body with realistic draping and lighting.
    - Use a clean, high-key studio background (white or light gray).
    - Ensure the output is a high-quality, full-body photograph.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimePerson,
              data: dataPerson
            }
          },
          {
            inlineData: {
              mimeType: mimeClothes,
              data: dataClothes
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    // Attempt to log text if no image found (helpful for debugging why it failed)
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart) {
        console.warn("Model returned text instead of image:", textPart.text);
        // Sometimes the model returns a text refusal. We log it.
    }

    throw new Error("No result image generated.");

  } catch (error) {
    console.error("Gemini Try-On Error:", error);
    throw error;
  }
};