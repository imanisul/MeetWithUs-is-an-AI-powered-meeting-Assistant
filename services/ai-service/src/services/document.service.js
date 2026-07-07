import fs from "fs";
import pdfParse from "../utils/pdf-parse.cjs";
import Document from "../models/Document.model.js";
import { splitIntoChunks } from "./chunk.service.js";
import { createEmbedding } from "./embedding.service.js";
import { storeChunks } from "./vector.service.js";

export const processDocument = async (file, uploadedBy) => {
    const buffer = fs.readFileSync(file.path);
    const pdf = await pdfParse(buffer);

    const document = await Document.create({
        fileName: file.originalname,
        filePath: file.path,
        extractedText: pdf.text,
        uploadedBy,
    });

    // RAG Pipeline: chunk, embed, and store
    const chunks = await splitIntoChunks(pdf.text);
    
    const embeddings = [];
    for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk.pageContent);
        embeddings.push(embedding);
    }

    await storeChunks(chunks, embeddings, document._id.toString());

    return document;
};