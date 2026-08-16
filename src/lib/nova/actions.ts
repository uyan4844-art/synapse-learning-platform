"use server";

import { getAiClient, type GeneratedQuizResult, type GeneratedQuestion, type NovaDiagnosticResult } from "./gemini-client";
import { getRealYouTubeTranscript } from "@/lib/transcript/youtube";

export type IngestionSourceType = "youtube" | "pdf" | "text" | "topic";

/**
 * Server Action: Generate genuine adaptive quiz matching exact country curriculum, track, subject and unit
 */
export async function generateNovaQuizAction(params: {
  sourceType?: IngestionSourceType;
  urlOrTopic: string;
  topicTitle?: string;
  pdfRawText?: string;
  countryName?: string;
  gradeLevel?: string;
  trackName?: string;
  subjectCategory?: string;
  subjectName?: string;
  specificUnitOrTopic?: string;
  difficulty?: string;
  languageLevel?: string;
  codingLanguage?: string;
  questionCount?: number;
  contentLanguage?: string;
}): Promise<{ success: boolean; data?: GeneratedQuizResult; error?: string }> {
  try {
    const {
      sourceType = "youtube",
      urlOrTopic,
      topicTitle,
      pdfRawText,
      countryName,
      gradeLevel = "Lise (9-12 / YKS)",
      trackName,
      subjectCategory,
      subjectName,
      specificUnitOrTopic,
      difficulty = "Orta",
      languageLevel,
      codingLanguage,
      questionCount = 5,
      contentLanguage = "Türkçe",
    } = params;

    let contextText = urlOrTopic;
    let computedTitle = topicTitle || subjectName || specificUnitOrTopic || urlOrTopic.slice(0, 50);

    // 1. Process specific input modalities with smart fallback to topic mode
    const isExplicitYouTube = sourceType === "youtube" && (urlOrTopic.includes("youtube.com") || urlOrTopic.includes("youtu.be"));
    
    if (isExplicitYouTube) {
      try {
        const transcriptResult = await getRealYouTubeTranscript(urlOrTopic);
        if (transcriptResult.source === "real_youtube_transcript" && transcriptResult.transcript) {
          contextText = transcriptResult.transcript;
          computedTitle = computedTitle.startsWith("http") ? `YouTube Dersi (${transcriptResult.videoId})` : computedTitle;
        } else {
          contextText = `Ders / Sınav Konusu: "${urlOrTopic}". İlgili dersin temel tanımları, kuralları ve örnek soru tipleri.`;
        }
      } catch {
        contextText = `Ders / Sınav Konusu: "${urlOrTopic}". İlgili dersin temel tanımları, kuralları ve örnek soru tipleri.`;
      }
    } else if (sourceType === "pdf" && pdfRawText) {
      contextText = pdfRawText;
      computedTitle = topicTitle || "Yüklenen PDF Ders Notu";
    } else if (sourceType === "text" && urlOrTopic) {
      contextText = urlOrTopic;
      computedTitle = topicTitle || "Özel Ders Metni & Notları";
    } else {
      // Default: Academic, Language, Coding or Topic without transcript
      const resolvedTopic = specificUnitOrTopic || subjectName || topicTitle || urlOrTopic || "Genel Kazanım Testi";
      contextText = `Ders / Kazanım Odak Alanı: "${resolvedTopic}". ${subjectName ? `Ders: ${subjectName}.` : ""} ${gradeLevel ? `Seviye: ${gradeLevel}.` : ""} ${languageLevel ? `Dil CEFR Seviyesi: ${languageLevel}.` : ""} ${codingLanguage ? `Programlama Dili: ${codingLanguage}.` : ""}`;
      computedTitle = resolvedTopic;
    }

    // Limit context length (first 15,000 chars)
    const sanitizedContext = contextText.slice(0, 15000);

    // Build rich context metadata prompt
    const academicContextMetadata = countryName ? `
SİSTEM CONTEXT:
- Ülke / Eğitim Sistemi: ${countryName}
- Eğitim Seviyesi / Sınıf: ${gradeLevel}
${trackName ? `- Alan / Branş (Track): ${trackName}` : ""}
${subjectCategory ? `- Ders Kategorisi: ${subjectCategory}` : ""}
${subjectName ? `- Ders Adı: ${subjectName}` : ""}
${specificUnitOrTopic ? `- Özel Ünite / Alt Konu: ${specificUnitOrTopic}` : ""}
Lütfen hazırlayacağın soruları bu ülkenin resmi müfredat standartlarına, pedagojik kazanımlarına, soru çözme tekniklerine ve terminolojisine %100 UYGUN OLARAK ÜRET.
` : `
HEDEF PARAMETRELER:
- Hedef Kademe / Seviye: "${gradeLevel}"
${languageLevel ? `- Yabancı Dil CEFR Seviyesi: "${languageLevel}" (A1-C2)` : ""}
${codingLanguage ? `- Programlama Dili: "${codingLanguage}"` : ""}
`;

    const isLanguageCategory = languageLevel || contentLanguage?.toLowerCase().includes("ingilizce") || contentLanguage?.toLowerCase().includes("english") || subjectName?.toLowerCase().includes("ingilizce") || subjectName?.toLowerCase().includes("almanca") || subjectName?.toLowerCase().includes("fransızca") || subjectName?.toLowerCase().includes("ispanyolca");

    const prompt = `
Role: You are SYNAPSE NOVA, a world-class educational AI specialized in generating rigorous, authentic, and curriculum-aligned test questions.
Task: Generate EXACTLY ${questionCount} unique, high-quality multiple-choice questions for the specified subject, level, and difficulty.

Context & Parameters:
- Target Domain: ${countryName ? `${countryName} Curriculum` : "Specialized Subject"}
- Grade / Level: ${gradeLevel}
- Subject / Branch: ${subjectName || "Academic"}
- Specific Topic / Focus: ${computedTitle}
- Difficulty Level: ${difficulty}
- Target CEFR Language Level: ${languageLevel || "N/A"}
${codingLanguage ? `- Target Programming Language: ${codingLanguage}` : ""}

Content Material / Reference:
"""
${sanitizedContext}
"""

STRICT GENERATION GUIDELINES:
1. NO DUMMY OR TEMPLATE PLACEHOLDERS: Generate completely authentic, context-specific questions with real problem statements, formulas, code snippets, or passage comprehension.
${isLanguageCategory ? `2. LANGUAGE LEARNING MODE: Questions, passages, and options MUST be written in the authentic TARGET language according to CEFR level (${languageLevel || "B1-B2"}), testing real grammar, vocabulary, sentence completion, and reading comprehension.` : `2. QUESTIONS DIVERSITY: Cover different cognitive levels (definition, application, problem solving, analysis) with unique plausible distractors.`}
3. OPTIONS: Provide exactly 4 options (A, B, C, D) per question. Only ONE option must have isCorrect: true, others must have isCorrect: false.
4. PEDAGOGY: Provide an insightful "hint" and a thorough step-by-step "explanation" explaining why the correct answer is right and why distractors are wrong.
5. OUTPUT: Return strictly valid JSON following the schema below without markdown backticks or extra commentary.

JSON Schema:
{
  "title": "${computedTitle}",
  "summary": "1-2 sentence concise pedagogical overview of the topic",
  "gradeLevel": "${gradeLevel}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Full authentic question text?",
      "options": [
        { "id": "A", "text": "Option A text", "isCorrect": true },
        { "id": "B", "text": "Option B text", "isCorrect": false },
        { "id": "C", "text": "Option C text", "isCorrect": false },
        { "id": "D", "text": "Option D text", "isCorrect": false }
      ],
      "hint": "Pedagogical hint guiding thinking process",
      "explanation": "Detailed step-by-step solution and analysis",
      "topic": "${subjectName || "Subject Topic"}"
    }
  ]
}
`;

    const ai = getAiClient();
    // Prioritize gemini-1.5-pro, gemini-1.5-flash, gemini-2.5-flash
    const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-flash", "gemini-flash-latest"];
    let lastError = "";

    // 25s Timeout guard
    const TIMEOUT_MS = 25000;

    for (const model of modelsToTry) {
      try {
        const generationPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Zaman aşımı (Timeout).")), TIMEOUT_MS);
        });

        const response: any = await Promise.race([generationPromise, timeoutPromise]);

        let rawText = response.text?.trim() || "";
        if (rawText.startsWith("```json")) {
          rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(rawText) as GeneratedQuizResult;

        if (parsed && parsed.questions && parsed.questions.length > 0) {
          return { success: true, data: parsed };
        }
      } catch (mErr: any) {
        console.warn(`Model ${model} error:`, mErr.message);
        lastError = mErr.message;
      }
    }

    return {
      success: false,
      error: `Yapay zeka soru üretiminde bir sorun oluştu (${lastError || "Geçersiz yanıt"}). Lütfen konuyu veya soru sayısını düzenleyip tekrar deneyin.`,
    };
  } catch (error: any) {
    console.error("NOVA Generation Action Error:", error);
    return {
      success: false,
      error: `Yapay zeka soru üretimi başarısız oldu: ${error.message || "Bilinmeyen hata"}. Lütfen tekrar deneyin.`,
    };
  }
}

/**
 * Server Action: NOVA Post-Session Diagnostic & Weak Topic Analysis
 */
export async function analyzeQuizPerformanceAction(results: {
  quizTitle: string;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  wrongTopics: string[];
}): Promise<{ success: boolean; data?: NovaDiagnosticResult; error?: string }> {
  try {
    const accuracy = Math.round((results.correctCount / results.totalQuestions) * 100);

    const diagnostic: NovaDiagnosticResult = {
      accuracyPercentage: accuracy,
      speedRating: results.timeSpentSeconds / results.totalQuestions < 15 ? "Hızlı" : "Dengeli",
      strongTopics: results.correctCount > 0 ? ["Temel Formül ve Kavram Uygulama"] : [],
      weakTopics: results.wrongTopics.map((topic) => ({
        topic,
        accuracy: 40,
        advice: `${topic} konusunda kavram yanılgılarına ve soru çözüm adımlarına dikkat edilmelidir.`,
      })),
      recommendedAction: accuracy >= 80 
        ? "Tebrikler! Konu hakimiyetiniz yüksek. Bir sonraki zorluk seviyesine veya canlı düellolara geçebilirsiniz."
        : "Zayıf tespit edilen alt konulardan odaklanmış pekiştirme seansı önerilmektedir."
    };

    return { success: true, data: diagnostic };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
