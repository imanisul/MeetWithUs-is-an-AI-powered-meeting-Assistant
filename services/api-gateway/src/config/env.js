import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    AUTH_SERVICE: process.env.AUTH_SERVICE || process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
    MEETING_SERVICE: process.env.MEETING_SERVICE || process.env.MEETING_SERVICE_URL || 'http://localhost:8002',
    AI_SERVICE: process.env.AI_SERVICE || process.env.AI_SERVICE_URL || 'http://localhost:8003',
};