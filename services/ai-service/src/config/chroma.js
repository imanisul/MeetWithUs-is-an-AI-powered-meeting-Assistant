import {ChromaClient} from 'chromadb';
import { env } from './env.js';

export const chroma = new ChromaClient({
    path: env.CHROMA_URL
});


