import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required : true,
            trim : true
        },
        description : {
            type : String, 
            default : '',
        },

        hostId : {
            type : String, 
            required : true
        },

        attendees : [
            {
                name : String,
                email : String,
                status : {
                    type : String,
                    enum: ['Pending', 'Accepted', 'Declined'],
                    default : 'Pending'
                }
            }
        ],

        meetingLink : {
            type: String,
            required : true
        },
        startTime: {
            type: Date,
            required : true,
        },
        endTime : {
            type : Date,
            required : true,
        },
        status : {
            type: String,
            enum : [
                'Scheduled',
                'Completed',
                'Cancelled'
            ],
            default: 'Scheduled'
        },



    }, {timestamps: true});

    const Meeting = mongoose.model('Meeting', meetingSchema);

    export default Meeting;