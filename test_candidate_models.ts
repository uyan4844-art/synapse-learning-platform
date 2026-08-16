import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [k, ...v] = line.split("=");
  if (k && v.length) envVars[k.trim()] = v.join("=").trim();
});

const candidates = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-pro-latest"
];

async function findWorkingModel() {
  const apiKey = envVars["GEMINI_API_KEY"] || "";
  const ai = new GoogleGenAI({ apiKey });

  for (const model of candidates) {
    try {
      console.log(`Testing model '${model}'...`);
      const response = await ai.models.generateContent({
        model,
        contents: "Respond only with: OK",
      });
      console.log(`✅ WORKING MODEL FOUND: '${model}' -> Output:`, response.text);
      return model;
    } catch (err: any) {
      console.log(`❌ Failed '${model}':`, err.message || err);
    }
  }
}

findWorkingModel();
