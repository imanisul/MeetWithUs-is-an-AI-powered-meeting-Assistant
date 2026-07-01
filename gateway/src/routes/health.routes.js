import {Router } from "express";

const router = Router();


router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message : "API is running successfully",
        service : "Gateway",
        timestamp : new Date(),
    });
});


export default router;