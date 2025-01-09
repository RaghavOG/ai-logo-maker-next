// utils/geminiApi.ts
import {
    GoogleGenerativeAI,
    
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

import { GeneratePromptResponse } from "@/types";


export async function getImagePrompt(userPrompt: string): Promise<GeneratePromptResponse> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: []  // You can add default history if needed
    });

    const result = await chatSession.sendMessage(userPrompt);
    const response = result.response.text();
    
    // Parse the JSON response from the string
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      const parsedResponse = JSON.parse(jsonMatch[1]);
      return {
        prompt: parsedResponse.prompt
      };
    }
    
    throw new Error("Invalid response format");

  } catch (error) {
    console.error("Error generating prompt:", error);
    return {
      prompt: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}