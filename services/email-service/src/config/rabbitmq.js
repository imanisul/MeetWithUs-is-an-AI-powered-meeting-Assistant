import amqp from 'amqplib';

let connection;
let channel;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect('amqp://localhost');

        channel = await connection.createChannel();

        console.log('Connected to RabbitMQ');

    } catch (error) {
        console.error('RabbitMQ Connection Error:', error);

        process.exit(1);
    }
};

export const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized.');
    }

    return channel;
};