import {Router } from 'express';

const router = Router();


router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "auth-service",
        message: "Auth service is up and running"
    });
});

export default router;