import amqp from 'amqplib';
import { env } from './env.js';

let channel ;

export const connectRabbitMQ = async () => {
    try{
        const connection = await amqp.connect(env.RABBITMQ_URL);
        channel = await connection.createChannel();

        console.log("RabbitMQ connected");
        
    }
    catch(error){
        console.log("RabbitMQ failed to connect", error);
        
    }
};

export const getChannel  = () => channel;