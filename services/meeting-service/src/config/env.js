import dotenv from 'dotenv';

dotenv.config();

export const env = {

    PORT : process.env.PORT || 8001,
    NODE_ENV : process.env.NODE_ENV || 'development',
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AI_SERVICE_URL: process.env.AI_SERVICE_URL,
}