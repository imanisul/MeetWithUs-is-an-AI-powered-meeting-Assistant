import { getRedisClient } from "../config/redis.js";

export const cacheMeeting = async (meeting) => {
    const redis = getRedisClient();

    await redis.set(
        `meeting:${meeting._id}`,
        JSON.stringify(meeting),
        {
            EX: 3600,
        }
    );
};