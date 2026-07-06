import {chroma} from '../config/chroma.js';

const test =async () => {

    const heartbeat = await chroma.heartbeat();

    console.log(heartbeat);
    
};

test();