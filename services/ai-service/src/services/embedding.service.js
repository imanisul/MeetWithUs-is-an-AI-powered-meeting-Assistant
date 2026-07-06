import {GoogleGenerativeAI} from '@google/generative-ai';
import {env} from '../config/env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const embeddingModel = genAI.getGenerativeModel({
    model : 'text-embedding-004',
});

export const createEmbedding = async (text) => {
    const result = await embeddingModel.embedContent(text);

    return result.embedding.values;
}