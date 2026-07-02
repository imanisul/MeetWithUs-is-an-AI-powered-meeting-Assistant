import validator from 'validator';

export const validRegisterInput = ({
    fullName, 
    email, 
    password
}) => {
    if(!fullName?.trim()){
        throw new Error('Full name is required');
    } 
    if(!validator.isEmail(email || '')){
        throw new Error('Email is invalid');
    }
    if(!password || password.length < 6){
        throw new Error('Password must be at least 6 characters ');
    }
};