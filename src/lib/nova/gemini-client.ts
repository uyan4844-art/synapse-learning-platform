import { GoogleGenAI } from "@google/genai";

export interface GeneratedQuestion {
  id: number;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  hint: string;
  explanation: string;
  topic: string;
}

export interface GeneratedQuizResult {
  title: string;
  summary: string;
  gradeLevel: string;
  difficulty: string;
  questions: GeneratedQuestion[];
}

export interface NovaDiagnosticResult {
  accuracyPercentage: number;
  speedRating: string;
  strongTopics: string[];
  weakTopics: { topic: string; accuracy: number; advice: string }[];
  recommendedAction: string;
}

/**
 * Get dynamic GoogleGenAI client instance
 */
export function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
}
