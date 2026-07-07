import app from './app.js';
import connectDB from './config/db.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import {env} from './config/env.js';

const startServer = async () => {
    await connectDB();
    await connectRabbitMQ();
};

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

startServer();