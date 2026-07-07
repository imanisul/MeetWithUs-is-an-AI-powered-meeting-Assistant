import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Organization from '../models/Organization.model.js';
import {validRegisterInput} from '../validators/auth.validator.js';
import {generateAccessToken, generateRefreshToken} from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async (userData) => {
    validRegisterInput(userData);

    const {fullName, email, password} = userData;

    const existingUser = await User.findOne({email, });

    if(existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user first without orgId
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: 'ORG_ADMIN',
    });

    // Auto-create a personal workspace
    const org = await Organization.create({
        name: `${fullName.split(' ')[0]}'s Workspace`,
        ownerId: user._id,
        members: [{ userId: user._id, role: 'ORG_ADMIN' }]
    });

    // Assign the org to the user
    user.organizationId = org._id;
    await user.save();

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
        organizationId: user.organizationId
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
        user: {
            id : user._id,
            fullName : user.fullName,
            email : user.email,
            role: user.role,
            organizationId: user.organizationId
        },
        accessToken,
        refreshToken
    };
};

