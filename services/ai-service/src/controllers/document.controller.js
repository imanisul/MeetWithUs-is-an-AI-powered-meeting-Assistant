import {processDocument  } from "../services/document.service.js";


export const uploadDocument = async (req,res) => {
    try {
        const result = await processDocument(req.file, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Document uploaded successfully',
            data: result,
        });

    } catch (error) {
        
        res.status(500).json({
            success: false,
            message : error.message,
        });
    }
};