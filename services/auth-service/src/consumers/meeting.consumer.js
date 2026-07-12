import { getChannel } from '../config/rabbitmq.js';
import Notification from '../models/Notification.model.js';
import User from '../models/user.model.js';

export const consumeMeetingEvents = async () => {
    const channel = getChannel();
    if (!channel) return;

    // Consume meeting created
    await channel.assertQueue('meeting-created');
    channel.consume('meeting-created', async (msg) => {
        if (msg !== null) {
            try {
                const meeting = JSON.parse(msg.content.toString());
                
                // Notify attendees
                if (meeting.attendees && meeting.attendees.length > 0) {
                    const emails = meeting.attendees.map(a => a.email);
                    const users = await User.find({ email: { $in: emails } });
                    
                    const notifications = users.map(user => ({
                        userId: user._id,
                        title: "New Meeting Scheduled",
                        description: `You have been invited to "${meeting.title}" on ${new Date(meeting.createdAt).toLocaleDateString()}.`,
                        type: 'MEETING_INVITE',
                        relatedEntityId: meeting._id.toString()
                    }));
                    
                    if (notifications.length > 0) {
                        await Notification.insertMany(notifications);
                    }
                }
                
                channel.ack(msg);
            } catch (error) {
                console.error("Error processing meeting-created event for notifications", error);
            }
        }
    });

    // Consume AI updated
    await channel.assertQueue('meeting-ai-updated');
    channel.consume('meeting-ai-updated', async (msg) => {
        if (msg !== null) {
            try {
                const meeting = JSON.parse(msg.content.toString());
                
                // Notify host and attendees
                const emails = meeting.attendees ? meeting.attendees.map(a => a.email) : [];
                const usersToNotify = await User.find({
                    $or: [
                        { email: { $in: emails } },
                        { _id: meeting.hostId }
                    ]
                });
                
                const notifications = usersToNotify.map(user => ({
                    userId: user._id,
                    title: "AI Summary Ready",
                    description: `The AI summary and action items for "${meeting.title}" are ready to review.`,
                    type: 'AI_SUMMARY_READY',
                    relatedEntityId: meeting._id.toString()
                }));
                
                if (notifications.length > 0) {
                    await Notification.insertMany(notifications);
                }
                
                channel.ack(msg);
            } catch (error) {
                console.error("Error processing meeting-ai-updated event", error);
            }
        }
    });

    console.log("Auth Service: Meeting events consumer connected");
};
