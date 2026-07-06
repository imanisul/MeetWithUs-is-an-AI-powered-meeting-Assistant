import {getChannel} from '../config/rabbitmq.js';
import {sendMeetingInvitation} from '../services/email.service.js';

export const consumeMeetingEvents = async () => {
    const channel = getChannel();

    const queue = 'meeting-created';

    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
        const meeting = JSON.parse(
            message.content.toString()
        );

        console.log("Meeting Event Received");

        await sendMeetingInvitation(meeting);

        channel.ack(message);
        
    });
};