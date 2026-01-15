export interface ProcessedImage {
  originalData: string; // Base64
  generatedData: string | null; // Base64 or URL
  mimeType: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
}

export enum PresetPrompt {
  REMOVE_BG = "Remove the background and place the object on a clean white background.",
  OFFICE_PORTRAIT = "Transform this into a business style portrait. Man sitting at a desk in an office. White shirt, blue tie, black suit. Papers, photos, laptop, and an ashtray on the table. Tajikistan flag visible in the background. High ranking official office atmosphere.",
  STUDIO_LIGHTING = "Enhance the lighting to look like a professional product photography studio with soft shadows.",
  CLEAN_UP = "Clean up the image, remove imperfections and improve clarity."
}