import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    AUTH_SERVICE : process.env.AUTH_SERVICE,
    MEETING_SERVICE: process.env.MEETING_SERVICE,
    AUTH_SERVICE: process.env.AUTH_SERVICE,
};