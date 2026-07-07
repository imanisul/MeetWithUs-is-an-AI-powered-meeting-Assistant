import {Router } from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import { env } from '../config/env.js';

const router = Router();

// Mount at root of router so req.url includes the prefix, or change pathRewrite to match the stripped url
router.use(
    '/auth',
    createProxyMiddleware({
        target: env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            return req.originalUrl.replace(/^\/auth/, '/api/v1/auth');
        }
    })
);

router.use(
    '/meetings',
    createProxyMiddleware({
        target: env.MEETING_SERVICE,
        changeOrigin:true,
        pathRewrite: (path, req) => {
            return req.originalUrl.replace(/^\/meetings/, '/api/v1/meetings');
        }
    })
);

router.use(
    '/ai',
    createProxyMiddleware({
        target: env.AI_SERVICE,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            return req.originalUrl.replace(/^\/ai/, '/api/v1/ai');
        }
    })
);

router.use(
    '/documents',
    createProxyMiddleware({
        target: env.AI_SERVICE, // Documents are handled in ai-service
        changeOrigin: true,
        pathRewrite: (path, req) => {
            return req.originalUrl.replace(/^\/documents/, '/api/v1/documents');
        }
    })
);

export default router;