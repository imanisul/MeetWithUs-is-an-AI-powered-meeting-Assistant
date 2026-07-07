import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    AUTH_SERVICE: process.env.AUTH_SERVICE_URL,
    MEETING_SERVICE: process.env.MEETING_SERVICE_URL,
    AI_SERVICE: process.env.AI_SERVICE_URL,
};