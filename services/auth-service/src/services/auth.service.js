import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

import {validRegisterInput} from '../validators/auth.validator.js';

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

