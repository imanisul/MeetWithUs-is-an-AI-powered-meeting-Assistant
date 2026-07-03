import crypto from 'crypto';

export const generateMeetingCode = () => {
    return crypto.randomUUID();
} 

