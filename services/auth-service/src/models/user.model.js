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
            default: 'ORG_ADMIN' // Default to ORG_ADMIN since they create their own workspace on signup
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        }

}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;