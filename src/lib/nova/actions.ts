"use server";

import { getAiClient, type GeneratedQuizResult, type NovaDiagnosticResult } from "./gemini-client";
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

    // 1. Process specific input modalities
    if (sourceType === "youtube" || urlOrTopic.includes("youtube.com") || urlOrTopic.includes("youtu.be")) {
      const transcriptResult = await getRealYouTubeTranscript(urlOrTopic);
      if (transcriptResult.source === "real_youtube_transcript" && transcriptResult.transcript) {
        contextText = transcriptResult.transcript;
        computedTitle = computedTitle.startsWith("http") ? `YouTube Dersi (${transcriptResult.videoId})` : computedTitle;
      } else {
        contextText = `YouTube Video / Ders Konusu: "${urlOrTopic}". İlgili dersin temel tanımları, formülleri ve soru tipleri.`;
      }
    } else if (sourceType === "pdf" && pdfRawText) {
      contextText = pdfRawText;
      computedTitle = topicTitle || "Yüklenen PDF Ders Notu";
    } else if (sourceType === "text") {
      contextText = urlOrTopic;
      computedTitle = topicTitle || "Özel Ders Metni & Notları";
    } else if (sourceType === "topic") {
      contextText = `Öğrenme Konusu: "${specificUnitOrTopic || subjectName || urlOrTopic}". Ders: ${subjectName || ""}, Kategori: ${subjectCategory || ""}.`;
      computedTitle = specificUnitOrTopic || subjectName || urlOrTopic;
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

    const prompt = `
Sen SYNAPSE platformunun resmi NOVA Akıllı Öğrenme ve Soru Sentezleme Motorusun.
Aşağıdaki ders materyaline ve müfredat parametrelerine dayanarak KESİNLİKLE TAM OLARAK ${questionCount} (Adet: ${questionCount}) adet pedagojik, çeldiricileri mantıklı ve yüksek kaliteli çoktan seçmeli soru üret.

${academicContextMetadata}

DERS MATERYALİ / KAYNAK İÇERİK:
"""
${sanitizedContext}
"""

PARAMETRELER:
- Konu / Başlık: "${computedTitle}"
- Zorluk Derecesi: "${difficulty}"
- Dil: "${contentLanguage}"
- İstenen Soru Sayısı: ${questionCount}

KURALLAR:
1. questions dizisinde TAM OLARAK ${questionCount} adet soru nesnesi bulunmalıdır. Eksik veya fazla soru üretme.
2. Her soru için 4 seçenek (A, B, C, D) belirle; yalnızca 1 tanesi doğru olsun (isCorrect: true).
3. Her soruya pedagojik bir "hint" (cevabı doğrudan vermeyen, formülü veya düşünme adımını hatırlatan ipucu) ekle.
4. "explanation" kısmında doğru cevabın çözüm adımlarını ve çeldirici şıkların mantığını detaylı anlat.
5. Yanıtı YALNIZCA geçerli bir JSON nesnesi olarak döndür (markdown backtick vb. ekleme).

JSON ŞEMASI:
{
  "title": "${computedTitle}",
  "summary": "Bu ders içeriğinin 1-2 cümlelik temel pedagojik özeti ve ana kazanımları",
  "gradeLevel": "${gradeLevel}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Soru metni?",
      "options": [
        { "id": "A", "text": "Seçenek A", "isCorrect": true },
        { "id": "B", "text": "Seçenek B", "isCorrect": false },
        { "id": "C", "text": "Seçenek C", "isCorrect": false },
        { "id": "D", "text": "Seçenek D", "isCorrect": false }
      ],
      "hint": "Pedagojik ipucu",
      "explanation": "Detaylı çözüm açıklaması",
      "topic": "${subjectName || "Konu Kazanımı"}"
    }
  ]
}
`;

    const ai = getAiClient();
    const modelsToTry = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"];
    let lastError = "";

    // Maximum 25 seconds timeout guard
    const TIMEOUT_MS = 25000;

    for (const model of modelsToTry) {
      try {
        const generationPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("İstek zaman aşımına uğradı (25s timeout).")), TIMEOUT_MS);
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
        console.warn(`Model ${model} error or timeout:`, mErr.message);
        lastError = mErr.message;
      }
    }

    return {
      success: false,
      error: `NOVA Soru Üretim Zaman Aşımı / Hatası: ${lastError || "Soru sentezlenemedi, lütfen tekrar deneyin."}`,
    };
  } catch (error: any) {
    console.error("NOVA Generation Action Error:", error);
    return {
      success: false,
      error: `NOVA Yapay Zeka Hatası: ${error.message || "Bilinmeyen bir hata oluştu."}`,
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
