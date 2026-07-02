import { registerUser, loginUser } from "../services/auth.service.js";



export const register = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
    });
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    const result = await loginUser (email, password);

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result,
    });
};