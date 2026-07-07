import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware to restrict access based on user role.
 * 
 * Hierarchy:
 * SUPER_ADMIN > ORG_ADMIN > MEMBER > GUEST
 */
export const requireRole = (allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ApiError(401, 'Unauthorized: Role not found');
        }

        const userRole = req.user.role;

        // SUPER_ADMIN has access to everything
        if (userRole === 'SUPER_ADMIN') {
            return next();
        }

        if (!allowedRoles.includes(userRole)) {
            throw new ApiError(403, `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`);
        }

        next();
    });
};
