import mongoose from 'mongoose';

const documentSchema =  new mongoose.Schema(
    {
        fileName : {
            type: String,
            required : true
        },
        filePath: {
            type:String,
            required: true,
        },
        extractedText : {
            type : String,
            required: true
        }, 
        uploadedBy : {
            type: String,
            required : true,
        }

    }, {timestamps: true});

    export default mongoose.model('Document', documentSchema);