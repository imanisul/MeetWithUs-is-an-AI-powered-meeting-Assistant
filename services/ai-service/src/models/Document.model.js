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
        size: {
            type: Number,
            required: false
        },
        uploadedBy : {
            type: String,
            required : true,
        },
        accessList: [
            {
                email: { type: String, required: true },
                role: { type: String, enum: ['ADMIN', 'CO_ADMIN', 'USER'], default: 'USER' }
            }
        ]

    }, {timestamps: true});

    export default mongoose.model('Document', documentSchema);