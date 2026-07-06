import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { authProxy } from './routes/auth.proxy.js';
import { meetingProxy } from './routes/meeting.proxy.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authProxy);
app.use('/api/v1/meetings', meetingProxy);

app.get('/', (req, res) => {
    res.json({
        success :true,
        service : 'API Gateway',
        message : 'MeetwithUs API is running'
    });
});


export default app;