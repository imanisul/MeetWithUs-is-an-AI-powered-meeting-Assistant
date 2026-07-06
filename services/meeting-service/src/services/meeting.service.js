import crypto from 'crypto';

import Meeting from '../models/Meeting.model.js';
import {publishMeetingCreated} from '../events/publisher.js';

import {generateMeetingCode} from '../utils/generateMeetingCode.js';
import { cacheMeeting } from './cache.service.js';

export const createMeeting = async (meetingData, hostId) => {
    const meetingCode = generateMeetingCode();


    const meetingLink = `https://meetwithus.com/meeting/${meetingCode}`;

    const meeting = await Meeting.create({
        ...meetingData,
        hostId,
        meetingLink,
    });

   

    await publishMeetingCreated(meeting);

     await cacheMeeting(meeting);

    return meeting;
}


export const updateAIContent  = async (meetingId, aiContent) => {
    return await Meeting.findByIdAndUpdate(

        meetingId, 
        {
            aiAgenda: aiContent.agenda,
            aiDiscussionPoints: aiContent.discussionPoints,
            aiActionItems : aiContent.actionItems,
        }, 
        {
            new: true,
        }
    );
};
