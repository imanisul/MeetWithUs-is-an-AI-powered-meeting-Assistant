import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import documentRoutes from "./routes/document.routes.js";
import aiRoutes from './routes/ai.routes.js';

const app = express();


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "AI Service",
        message: "AI Service is running successfully",
    });
});


app.use("/api/v1/documents", documentRoutes);

app.use('/api/v1/ai', aiRoutes)

export default app;