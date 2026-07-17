import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/user.model.js';


export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    res
     .status(200)
     .json(
        new ApiResponse(200, "Profile fetched successfully", user)
     );
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName } = req.body;
    
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { fullName },
        { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", user)
    );
});