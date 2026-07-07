import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT : process.env.PORT || 8004,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASS : process.env.EMAIL_PASS,
    RABBITMQ_URL : process.env.RABBITMQ_URL || 'amqp://localhost',
};