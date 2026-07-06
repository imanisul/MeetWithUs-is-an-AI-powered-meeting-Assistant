import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import proxyRoutes from './routes/proxy.routes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', proxyRoutes);

app.get('/', (req, res) => {
    res.json({
        success :true,
        service : 'API Gateway',
        message : 'MeetwithUs API is running'
    });
});


export default app;