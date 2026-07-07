import { generateAgenda, generateSummary as generateSummaryService, generateActionItems as generateActionItemsService } from "../services/ai.service.js";

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

export const generateSummary = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes) {
            return res.status(400).json({ success: false, message: "Notes are required" });
        }

        const summary = await generateSummaryService(notes);

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const generateActionItems = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes) {
            return res.status(400).json({ success: false, message: "Notes are required" });
        }

        const actionItems = await generateActionItemsService(notes);

        res.status(200).json({
            success: true,
            data: actionItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};