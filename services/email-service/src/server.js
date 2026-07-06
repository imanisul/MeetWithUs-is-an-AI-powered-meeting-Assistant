import app from './app.js';

import {env} from './config/env.js';

import {connectRabbitMQ} from './config/rabbitmq.js';

import {consumeMeetingEvents} from './consumers/meeting.consumer.js';

const startServer = async () => {
    try {
        await connectRabbitMQ();

        console.log("RabbitMQ is connected");

        await consumeMeetingEvents();

        app.listen(env.PORT, () => {
             console.log(`Email Service is runing in port ${env.PORT}`);
        });
 
        
    } catch (error) {
        console.error("Failed to start Email Service", error);

        process.exit(1);
    }
};

startServer();