import { registerUser } from "../services/auth.service.js";



export const register = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
    });
};