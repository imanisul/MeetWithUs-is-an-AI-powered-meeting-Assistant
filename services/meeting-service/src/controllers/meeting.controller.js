import * as meetingService from '../services/meeting.service.js';

export const createMeeting = async (req, res) => {
    const meeting = await meetingService.createMeeting(
        req.body,
        req.user.id
    );

    res.status(201).json({
        success : true,
        data : meeting,
    })
};

export const updateAI = async (req, res) => {
    const meeting = await meetingService.updateAIContent(
        req.params.id,
        req.body
    );

    res.json({
        success : true,
        meeting,
    });

};   