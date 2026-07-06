import fs from "fs";

import pdfParse from "../utils/pdf-parse.cjs";

import Document from "../models/Document.model.js";

export const processDocument = async (

    file,

    uploadedBy

) => {

    const buffer = fs.readFileSync(file.path);

    const pdf = await pdfParse(buffer);

    const document = await Document.create({

        fileName: file.originalname,

        filePath: file.path,

        extractedText: pdf.text,

        uploadedBy,

    });

    return document;

};