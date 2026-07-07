import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

import {validRegisterInput} from '../validators/auth.validator.js';

import {generateAccessToken, generateRefreshToken} from '../utils/jwt.js';

import ApiError from '../utils/ApiError.js';

export const registerUser = async (userData) => {
    validRegisterInput(userData);


    const {fullName, email, password, role} = userData;

    const existingUser = await User.findOne({email, });

    if(existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password : hashedPassword,
        role: role || 'user',
    });

    return user;
};


export const loginUser = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new ApiError(401, 'Invalid email or password');
    }

    const payload = {
        id : user._id,
        email : user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);


    return {
        user: {
            id : user._id,
            fullName : user.fullName,
            email : user.email,
            role: user.role,
        },
        accessToken,
        refreshToken
    };
};

