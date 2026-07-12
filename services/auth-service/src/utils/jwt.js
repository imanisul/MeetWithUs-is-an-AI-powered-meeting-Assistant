import jwt from 'jsonwebtoken';
import {env } from '../config/env.js';


export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, 
        {expiresIn : '7d'}
    );
};


export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn : '7d',
    });
};


