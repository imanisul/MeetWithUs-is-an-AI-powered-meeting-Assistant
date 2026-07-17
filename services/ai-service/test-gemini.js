import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001"});
  try {
    const result = await model.embedContent("Hello world");
    console.log("Success with gemini-embedding-001", result.embedding.values.slice(0, 5));
  } catch (e) {
    console.error("gemini-embedding-001 failed", e.message);
  }
}
run();
