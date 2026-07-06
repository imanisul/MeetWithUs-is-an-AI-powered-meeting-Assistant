import {Router } from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import env from '../config/env.js';

const router = Router();

router.use('/auth', 
    createProxyMiddleware({
        target:env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            '^/auth': '/api/v1/auth',
        },
    })
);

router.use('/meetings', 
    createProxyMiddleware({
        target: env.MEETING_SERVICE,
        changeOrigin:true,
        pathRewrite: {
            '^/meetings':'/api/v1/meetings',
        },
    })
);

router.use('/api',
    createProxyMiddleware({
        target: env.AI_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            '^/ai' : '/api/v1/ai'
        },
    })
);


export default router;