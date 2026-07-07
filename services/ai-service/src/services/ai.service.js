import {model} from '../config/gemini.js';
import { buildAgentPrompt } from '../prompts/agenda.prompt.js';

export const generateAgenda = async (meeting) => {
    const prompt = buildAgentPrompt(meeting);
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export const generateSummary = async (notes) => {
    const prompt = `You are an expert AI meeting assistant. Please analyze the following raw meeting notes and provide a concise, well-structured, professional executive summary of the discussion.\n\nMeeting Notes:\n${notes}\n\nExecutive Summary:`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export const generateActionItems = async (notes) => {
    const prompt = `You are an expert AI meeting assistant. Please analyze the following raw meeting notes and extract a clear, bulleted list of actionable items. For each item, identify who is responsible if mentioned.\n\nMeeting Notes:\n${notes}\n\nAction Items (Markdown Bullet Points):`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}