import crypto from 'crypto';

import Meeting from '../models/Meeting.model.js';

import {generateMeetingCode} from '../utils/generateMeetingCode.js';

export const createMeeting = async (meetingData, hostId) => {
    const meetingCode = generateMeetingCode();


    const meetingLink = `https://meetwithus.com/meeting/${meetingId}`;

    const meeting = await Meeting.create({
        ...meetingData,
        hostId,
        meetingLink,
    });

    return meeting;
}

