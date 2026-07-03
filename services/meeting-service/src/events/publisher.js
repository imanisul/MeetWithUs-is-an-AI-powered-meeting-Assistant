import {getChannel } from '../config/rabbitmq.js'


export const publishMeetingCreated = async (meeting) => {

    const channel = getChannel();

    const queue = 'meeting-created';

    await channel.assertQueue(queue);

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(meeting))
    );

    console.log("Meeting Event Published");
    
    
    
};