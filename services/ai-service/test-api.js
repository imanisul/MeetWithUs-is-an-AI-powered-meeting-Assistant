import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: 'services/ai-service/.env' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  try {
    const result = await model.generateContent("Say hi");
    console.log("result.response.text():", typeof result.response.text === 'function' ? result.response.text() : "no text function");
  } catch (e) {
    console.error("error:", e);
  }
}
run();
