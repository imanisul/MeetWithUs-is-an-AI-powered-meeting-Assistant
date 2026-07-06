import {createProxyMiddleware} from 'http-proxy-middleware';

import {env} from '../config/env.js';

export const meetingProxy = createProxyMiddleware({
    target: env.MEETING_SERVICE,
    changeOrigin: true,
});