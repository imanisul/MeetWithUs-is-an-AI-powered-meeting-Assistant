import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['ORG_ADMIN', 'MEMBER', 'GUEST'],
            default: 'MEMBER'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
