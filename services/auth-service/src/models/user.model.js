import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullName : {
            type: String,
            required: true,
            trim: true
        }, 
        email :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        }, 
       password : {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER', 'GUEST'],
            default: 'GUEST' // Changed from ORG_ADMIN to GUEST as per user requirement
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        }

}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;