import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['MEETING_INVITE', 'AI_SUMMARY_READY', 'ORG_INVITE', 'GENERAL'],
            default: 'GENERAL'
        },
        read: {
            type: Boolean,
            default: false
        },
        relatedEntityId: {
            type: String, // Can store meetingId, orgId etc
            default: null
        }
    }, 
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
