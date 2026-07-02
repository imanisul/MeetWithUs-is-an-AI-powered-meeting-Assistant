import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

import {validRegisterInput} from '../validators/auth.validator.js';

import {generateAccessToken, generateRefreshToken} from '../utils/jwt.js';

export const registerUser = async (userData) => {
    validRegisterInput(userData);


    const {fullName, email, password} = userData;

    const existingUser = await User.findOne({email, });

    if(existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password : hashedPassword,
    });

    return user;
};


export const loginUser = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new Error('Invalid email or password');
    }

    const payload = {
        id : user._id,
        enail : user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);


    return {
        user: {
            id : user._id,
            fullName : user.fullName,
            email : user.email,
        },
        accessToken,
        refreshToken
    };
};

