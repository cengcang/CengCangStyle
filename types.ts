export interface PresetImage {
  id: string;
  url: string;
  label: string;
}

export enum AppStep {
  SELECT_PERSON = 1,
  SELECT_CLOTHES = 2,
  RESULT = 3,
}

export interface HistoryItem {
  id: string;
  personImage: string;
  clothingImage: string;
  resultImage: string;
  timestamp: number;
}

export type LoadingState = 'idle' | 'generating_clothes' | 'generating_tryon' | 'error';
