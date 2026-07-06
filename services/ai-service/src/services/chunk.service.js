export const splitIntoChunks = (
    text,
    chuckSize = 500
) => {
    const chunks = [];

    for(let i =0; i<text.length; i += chunkSize){
        chunks.push(
            text.slice(i, i+chuckSize)
        );
    }

    return chunks;
};