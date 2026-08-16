import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [k, ...v] = line.split("=");
  if (k && v.length) envVars[k.trim()] = v.join("=").trim();
});

async function listModels() {
  const apiKey = envVars["GEMINI_API_KEY"] || "";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const models = await ai.models.list();
    console.log("Available Models for your Key:");
    for await (const m of models) {
      console.log("-", m.name);
    }
  } catch (err: any) {
    console.error("List Models Error:", err.message);
  }
}

listModels();
