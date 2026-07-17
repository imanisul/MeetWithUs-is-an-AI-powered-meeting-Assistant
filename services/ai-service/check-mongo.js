import mongoose from 'mongoose';
import Document from './src/models/Document.model.js';

mongoose.connect('mongodb://localhost:27017/meetwithus-ai')
    .then(async () => {
        const docs = await Document.find({});
        console.log(docs.map(d => ({ name: d.fileName, size: d.size, id: d._id })));
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
