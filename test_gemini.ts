import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [k, ...v] = line.split("=");
  if (k && v.length) envVars[k.trim()] = v.join("=").trim();
});

async function testGemini() {
  const apiKey = envVars["GEMINI_API_KEY"] || "";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Return a JSON: {\"status\": \"ok\", \"message\": \"NOVA Connected successfully\"}",
      config: { responseMimeType: "application/json" }
    });
    console.log("SUCCESS! Gemini Output:", response.text);
  } catch (err: any) {
    console.error("Gemini Error:", err);
  }
}

testGemini();
