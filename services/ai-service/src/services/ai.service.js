import {model} from '../config/gemini.js';
import { buildAgentPrompt } from '../prompts/agenda.prompt.js';

export const generateAgenda = async (meeting) => {
    const prompt = buildAgentPrompt(meeting);

    const result = await model.generateContent(prompt);

    return result.response.text();
}