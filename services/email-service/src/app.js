import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        service : 'email-service',
        message: 'Email Service is Running',
    });
});

export default app;