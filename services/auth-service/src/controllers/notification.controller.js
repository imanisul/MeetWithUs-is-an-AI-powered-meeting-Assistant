import Notification from '../models/Notification.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);
        
    res.status(200).json(new ApiResponse(200, 'Notifications fetched successfully', notifications));
});

export const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { userId: req.user.id, read: false },
        { $set: { read: true } }
    );
    
    res.status(200).json(new ApiResponse(200, 'Notifications marked as read successfully', null));
});
