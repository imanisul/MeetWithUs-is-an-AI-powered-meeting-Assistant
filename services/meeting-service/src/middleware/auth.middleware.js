import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import {env } from '../config/env.js';


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return next (
            new ApiError(401, 'Authorization header missing')
        );
    }

    if(!authHeader.startsWith('Bearer ')) {
        return next (
            new ApiError(401, 'Invalid authorization header format')
        );
    }

    const token = authHeader.replace(/^Bearer\s+/, "").trim();

    try{
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;

        next();
    }
    catch(error){
        next(
            new ApiError(401, 'Invalid or expired token')
        );
    }
};


export default verifyJWT;