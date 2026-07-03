import amqp from 'amqplib';

let channel ;

export const connectRabbitMQ = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        console.log("RabbitMQ connected");
        
    }
    catch(error){
        console.log("RabbitMQ failed to connect", error);
        
    }
};

export const getChannel  = () => channel;