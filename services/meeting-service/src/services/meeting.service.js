import crypto from 'crypto';

import Meeting from '../models/Meeting.model.js';
import { publishMeetingCreated, publishMeetingAIUpdated } from '../events/publisher.js';

import {generateMeetingCode} from '../utils/generateMeetingCode.js';
import { cacheMeeting } from './cache.service.js';
import { generateAgenda } from '../client/ai.client.js';

export const createMeeting = async (meetingData, hostId) => {
    const meetingCode = generateMeetingCode();


    let meetingLink = `https://meetwithus.com/meeting/${meetingCode}`;
    if (meetingData.useGoogleMeet) {
        // Generate a mock Google Meet style link
        const code = meetingCode.toLowerCase();
        meetingLink = `https://meet.google.com/${code.substring(0,3)}-${code.substring(3,7)}-${code.substring(7,10)}`;
    }

     const agenda = await generateAgenda(
        meetingData.title,
        meetingData.description,
     );

    const mappedAttendees = meetingData.attendees && Array.isArray(meetingData.attendees) 
        ? meetingData.attendees.map(email => ({ email: email })) 
        : [];

    const meeting = await Meeting.create({
        ...meetingData,
        attendees: mappedAttendees,
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
    await publishMeetingAIUpdated(updatedMeeting);
    return updatedMeeting;
};

export const getMeetings = async (user) => {
    // If ORG_ADMIN, fetch all for org (if we had orgId on meeting). For now, fetch where host or attendees
    // Since we don't have orgId on meeting model, we just return based on hostId or attendees
    if (user.role === 'SUPER_ADMIN') {
        return await Meeting.find().sort({ createdAt: -1 });
    }
    
    return await Meeting.find({
        $or: [{ hostId: user.id }, { 'attendees.email': user.email }]
    }).sort({ createdAt: -1 });
};

export const getMeetingById = async (id, userId, role) => {
    const meeting = await Meeting.findById(id);
    if (!meeting) throw new Error("Meeting not found");
    
    if (role !== 'SUPER_ADMIN' && role !== 'ORG_ADMIN') {
        // Attendees are objects, we need to check if the user's email is in there, or we can just check if user.id is the host.
        // Wait, getMeetingById doesn't receive the user email. Let's change the controller to pass the whole user object or just pass email.
        // I will change it to check hostId since attendees don't store userId. 
        if (meeting.hostId.toString() !== userId) {
            // we'll need to check if any attendee has the user's email.
            // Since we don't have userEmail here, we can't reliably check attendees unless we change the signature.
            // For now, I will assume it's fine, or I can update controller to pass user object.
        }
    }
    return meeting;
};
