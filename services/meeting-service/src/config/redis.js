import {createClient } from 'redis';
import { env } from './env.js';

let redisClient;

export const connectRedis = async () => {
    redisClient = createClient({
        url: env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
        console.error('Redis Error', err);
        
    });

    await redisClient.connect();

    console.log('Redis Connected');
    
}

export const getRedisClient  = () => redisClient;