import fs from "fs";
import pdfParse from "../utils/pdf-parse.cjs";
import Document from "../models/Document.model.js";
import { splitIntoChunks } from "./chunk.service.js";
import { createEmbedding } from "./embedding.service.js";
import { storeChunks, searchChunks } from "./vector.service.js";
import { model } from "../config/gemini.js";

export const queryVectorStore = async (query, user) => {
    // 1. Fetch allowed documents for the user
    const allowedDocs = await Document.find({
        $or: [
            { uploadedBy: user.id },
            { "accessList.email": user.email }
        ]
    }).select('_id');
    
    if (allowedDocs.length === 0) {
        return { answer: "I couldn't find any relevant meeting information for your query. You may not have access to any documents.", sources: [] };
    }
    
    const allowedDocIds = allowedDocs.map(d => d._id.toString());

    // 2. Search only in allowed documents
    const queryEmbedding = await createEmbedding(query);
    const results = await searchChunks(queryEmbedding, allowedDocIds, 3);
    
    const documents = results.documents[0] || [];
    
    if (documents.length === 0) {
        return { answer: "I couldn't find any relevant meeting information for your query.", sources: [] };
    }
    
    const context = documents.join('\n\n');
    const prompt = `You are a helpful AI meeting assistant. Answer the user's query based ONLY on the following context retrieved from meeting transcripts.\n\nContext:\n${context}\n\nQuery: ${query}`;
    
    const response = await model.generateContent(prompt);
    
    return {
        answer: response.response.text(),
        sources: documents,
    };
};
export const processDocument = async (file, uploadedBy) => {
    const buffer = fs.readFileSync(file.path);
    const pdf = await pdfParse(buffer);

    const document = await Document.create({
        fileName: file.originalname,
        filePath: file.path,
        extractedText: pdf.text,
        size: file.size,
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