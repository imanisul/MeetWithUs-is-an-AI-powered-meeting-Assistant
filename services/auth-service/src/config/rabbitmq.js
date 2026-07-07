import amqp from 'amqplib';
import { env } from './env.js';

let channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        console.log("Auth Service: RabbitMQ connected");
    } catch (error) {
        console.log("Auth Service: RabbitMQ failed to connect", error);
    }
};

export const getChannel = () => channel;
