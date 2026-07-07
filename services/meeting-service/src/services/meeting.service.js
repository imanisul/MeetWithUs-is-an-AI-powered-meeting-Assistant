import crypto from 'crypto';

import Meeting from '../models/Meeting.model.js';
import {publishMeetingCreated} from '../events/publisher.js';

import {generateMeetingCode} from '../utils/generateMeetingCode.js';
import { cacheMeeting } from './cache.service.js';
import { generateAgenda } from '../client/ai.client.js';

export const createMeeting = async (meetingData, hostId) => {
    const meetingCode = generateMeetingCode();


    const meetingLink = `https://meetwithus.com/meeting/${meetingCode}`;

     const agenda = await generateAgenda(
        meetingData.title,
        meetingData.description,
     );

    const meeting = await Meeting.create({
        ...meetingData,
        hostId,
        meetingCode,
        meetingLink,
        agenda,
    });

   

   

    await publishMeetingCreated(meeting);

     await cacheMeeting(meeting);

    return meeting;
}


export const updateAIContent  = async (meetingId, aiContent) => {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
        meetingId, 
        {
            aiAgenda: aiContent.agenda,
            aiDiscussionPoints: aiContent.discussionPoints,
            aiActionItems: aiContent.actionItems,
            aiSummary: aiContent.summary,
            notes: aiContent.notes,
        }, 
        {
            new: true,
        }
    );

    await cacheMeeting(updatedMeeting);
    return updatedMeeting;
};
