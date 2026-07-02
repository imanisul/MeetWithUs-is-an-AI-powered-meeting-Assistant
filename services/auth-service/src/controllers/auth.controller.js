import { registerUser, loginUser } from "../services/auth.service.js";

import ApiResponse from '../utils/ApiResponse.js';

import asyncHandler from '../utils/asyncHandler.js';



export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json(new ApiResponse(201, 'User registered successfully', user));
});

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const result = await loginUser (email, password);

    res.status(200)
    .json(new ApiResponse(200,'User logged in successfully', result));
});