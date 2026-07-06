import {createProxyMiddleware} from 'http-proxy-middleware';
import {env} from '../config/env.js';


export const authProxy = createProxyMiddleware({
    target: env.AUTH_SERVICE,
    changeOrigin: true,
});