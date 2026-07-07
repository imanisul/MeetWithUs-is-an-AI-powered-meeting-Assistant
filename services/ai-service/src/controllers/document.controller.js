import { processDocument, queryVectorStore } from "../services/document.service.js";


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

export const searchDocuments = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query 'q' is required" });
        }
        
        const result = await queryVectorStore(q);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};