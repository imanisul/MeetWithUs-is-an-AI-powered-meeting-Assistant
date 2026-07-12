import dotenv from 'dotenv';

dotenv.config();


export const env = {
    PORT : process.env.PORT || 8002,
    NODE_ENV : process.env.NODE_ENV || 'development',
    MONGO_URI : process.env.MONGO_URI || 'mongodb://localhost:27017/meetwithus-auth',
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET,
    RABBITMQ_URL : process.env.RABBITMQ_URL || 'amqp://localhost'
};