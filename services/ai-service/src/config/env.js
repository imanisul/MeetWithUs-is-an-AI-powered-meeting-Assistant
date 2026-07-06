import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8005,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/meetwithus-ai',
};

