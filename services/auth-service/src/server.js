import app from './app.js';
import connectDB from './config/db.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import {env} from './config/env.js';

import { consumeMeetingEvents } from './consumers/meeting.consumer.js';

const startServer = async () => {
    await connectDB();
    await connectRabbitMQ();
    await consumeMeetingEvents();
};

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

startServer();