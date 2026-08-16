import { getSubtitles } from "youtube-captions-scraper";

export interface YouTubeVideoInfo {
  videoId: string;
  transcript: string;
  source: "real_youtube_transcript" | "topic_generation" | "error";
  error?: string;
}

/**
 * Extracts YouTube Video ID from any URL format
 */
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Robust Multi-Engine YouTube Transcript Fetcher
 */
export async function getRealYouTubeTranscript(urlOrId: string): Promise<YouTubeVideoInfo> {
  const videoId = extractYouTubeId(urlOrId) || urlOrId;

  // Try fetching subtitles across Turkish, English, and auto-generated captions
  const langsToTry = ["tr", "en", "es", "de", "fr"];

  for (const lang of langsToTry) {
    try {
      const captions = await getSubtitles({
        videoID: videoId,
        lang,
      });

      if (captions && captions.length > 0) {
        const fullText = captions.map((c: any) => c.text).join(" ");
        if (fullText.trim().length > 20) {
          return {
            videoId,
            transcript: fullText,
            source: "real_youtube_transcript",
          };
        }
      }
    } catch {
      // try next language
    }
  }

  return {
    videoId,
    transcript: "",
    source: "error",
    error: "Bu YouTube videosunda erişilebilir bir altyazı veya transkript bulunamadı. Lütfen altyazısı bulunan bir video girin ya da doğrudan konu adı ile test üretin.",
  };
}
