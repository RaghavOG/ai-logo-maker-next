import { Dispatch, SetStateAction } from "react";

export interface ColorScheme {
  name: string;
  colors: string[];
}

export interface GenerationState {
  prompt?: string;
  isGenerating: boolean;
  retryCount: number;
  lastAttempt: number;
}

export type UserDetails = {
  creditsLeft: number;
  email: string;
  isPro: boolean;
  name: string;
  proSince?: number | null;  // Optional and can be null
  userId: string;
};

// Define the context type
export type UserDetailsContextType = {
  userDetails: UserDetails | null;
  setUserDetails: Dispatch<SetStateAction<UserDetails | null>>;
};


export interface LogoFormData {
    title: string;
    description: string;
    colorScheme: string;
    logoStyle: string;
    customColors: string[];
  }
  
export interface GeneratePromptResponse {
  prompt: string;
  error?: string;
}