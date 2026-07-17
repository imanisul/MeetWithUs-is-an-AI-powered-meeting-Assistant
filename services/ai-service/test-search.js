import mongoose from "mongoose";
import { queryVectorStore } from "./src/services/document.service.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await queryVectorStore("what decision");
        console.log("Success:", result);
    } catch (e) {
        console.error("Error running queryVectorStore:", e);
    } finally {
        mongoose.disconnect();
    }
}
run();
