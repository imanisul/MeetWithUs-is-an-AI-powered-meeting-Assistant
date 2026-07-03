import app from './app.js';

import connectDB from './config/db.js';

import { env } from './config/env.js';

import { connectRabbitMQ } from './config/rabbitmq.js';

const startServer = async () => {
    try {
        await connectDB();

        await connectRabbitMQ();

        app.listen(env.PORT, () => {
            console.log(`Meeting service is runing on port ${env.PORT}`);
            
        });
    } catch (error) {
      console.log('Failed to connect the server', error);

      process.exit(1);
        
    }
};

startServer()