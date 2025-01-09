import { LogoFormData } from '@/types';


export const generatePrompt = (formData: LogoFormData): string => {
  const basePrompt = `Generate a text prompt to create a logo for Logo Title / Brand Name: {logoTitle}, with description: {logoDescription}, with color combination: {colorCombination}, and include {logoDesignIdea}. Referring to this {logoPrompt}, give me the result in JSON format with a prompt field only.`;

  const colorCombination = `[${formData.customColors.join(', ')}]`
   

  return basePrompt
    .replace('{logoTitle}', formData.title)
    .replace('{logoDescription}', formData.description)
    .replace('{colorCombination}', colorCombination)
    .replace('{logoDesignIdea}', formData.logoStyle)
    .replace('{logoPrompt}', `${formData.title} ${formData.description}`);
};