import { generateNovaQuizAction } from "./src/lib/nova/actions";

async function testFullGeneration() {
  console.log("Testing generateNovaQuizAction with real Gemini model...");
  const result = await generateNovaQuizAction({
    urlOrTopic: "Osmanlı Devleti Kuruluş Dönemi ve Padişahları",
    gradeLevel: "10. Sınıf",
    difficulty: "Orta",
    questionCount: 5,
    contentLanguage: "Türkçe",
  });

  console.log("Full Result:", JSON.stringify(result, null, 2));
}

testFullGeneration();
