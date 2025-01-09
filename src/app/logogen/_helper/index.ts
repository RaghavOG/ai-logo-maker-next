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

export const colorSchemes = [
    { name: 'Scheme 1', colors: ['#F6FEDB', '#E6D3A3', '#D8D174', '#B6C454', '#91972A'] },
    { name: 'Scheme 3', colors: ['#616163', '#44FFD2', '#87F6FF', '#DAF5FF', '#FFBFA0'] },
    { name: 'Scheme 4', colors: ['#F9E0D9', '#E6DBD0', '#7D6167', '#754F5B', '#5D4954'] },
    { name: 'Scheme 5', colors: ['#CACFD6', '#D6E5E3', '#9FD8CB', '#517664', '#2D3319'] },
    { name: 'Scheme 6', colors: ['#F3E0EC', '#EAD5E6', '#F2BEFC', '#CA9CE1', '#685F74'] },
    { name: 'Scheme 8', colors: ['#000505', '#3B3355', '#5D5D81', '#BFCDE0', '#FEFCFD'] },
  ]
  
  export const logoStyles = [
    'Cartoon Logo',
    'App Logo',
    'Modern Mascot Logos',
    'Black And White Line Logos',
    'Minimalists And Elegants Logos',
    'Vintage Custom Logos',
    'Modern Sharp Lined Logos',
    'Custom Luxury Logo Designs',
    'Vintage Logo Designs With Text & Icon',
  ]
  