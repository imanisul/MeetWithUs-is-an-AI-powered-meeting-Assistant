import { chroma } from "../config/chroma.js";

export const getCollection = async () => {
    return await chroma.getOrCreateCollection({
        name: "meeting_documents",
    });
};

export const storeChunks = async (
    chunks,
    embeddings,
    documentId
) => {

    const collection = await getCollection();

    const ids = chunks.map((_, index) => `${documentId}-${index}`);

    const documents = chunks.map(chunk => chunk.pageContent);

    const metadatas = chunks.map(() => ({
        documentId,
    }));

    await collection.add({
        ids,
        embeddings,
        documents,
        metadatas,
    });
};