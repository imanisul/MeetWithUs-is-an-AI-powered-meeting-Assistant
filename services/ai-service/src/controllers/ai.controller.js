import { generateAgenda } from "../services/ai.service.js";

export const createAgenda = async (req, res) => {
    try {
        const {title, description} = req.body;

        const agenda = await generateAgenda(
            { title, description }
        );

        res.status(200).json({
            success: true,
            data: agenda,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};