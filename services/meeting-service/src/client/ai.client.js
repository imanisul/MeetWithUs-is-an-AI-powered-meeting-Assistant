import axios from 'axios';
import {env } from '../config/env.js';

export const generateAgenda = async (title, description) => {
    const response = await axios.post(
        `${env.AI_SERVICE_URL}/api/v1/generate-agenda`,
        {
            title,
            description,
        }
    );
    return response.data.data;
}