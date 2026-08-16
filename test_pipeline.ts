import { getRealYouTubeTranscript } from "./src/lib/transcript/youtube";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

// Read .env.local manually
const envContent = fs.readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [k, ...v] = line.split("=");
  if (k && v.length) envVars[k.trim()] = v.join("=").trim();
});

async function testPipeline() {
  console.log("1. Testing YouTube Transcript on real video...");
  const testUrl = "https://www.youtube.com/watch?v=kYIPFmJ0j9M";
  const transcriptResult = await getRealYouTubeTranscript(testUrl);
  console.log("Transcript Output:", {
    source: transcriptResult.source,
    error: transcriptResult.error,
    textLength: transcriptResult.transcript?.length || 0,
    snippet: transcriptResult.transcript?.slice(0, 150),
  });

  console.log("\n2. Testing Gemini API Key...");
  const apiKey = envVars["GEMINI_API_KEY"] || "";
  console.log("Key:", apiKey.slice(0, 12) + "...");
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Return a JSON: {\"status\": \"ok\", \"message\": \"NOVA connected\"}",
      config: { responseMimeType: "application/json" }
    });
    console.log("Gemini API Response Success:", response.text);
  } catch (err: any) {
    console.error("Gemini API Error Detail:", err);
  }
}

testPipeline();
