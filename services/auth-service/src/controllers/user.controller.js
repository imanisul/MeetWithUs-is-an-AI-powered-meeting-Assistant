import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';


export const getProfile = asyncHandler(async (req, res) => {
    res
     .status(200)
     .json(
        new ApiResponse(200, "Profile fetched successfully", req.user)
     );
});