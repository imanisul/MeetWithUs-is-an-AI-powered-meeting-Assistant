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

export const publishMeetingAIUpdated = async (meeting) => {
    const channel = getChannel();
    if (!channel) return;
    const queue = 'meeting-ai-updated';
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(meeting)));
    console.log("Meeting AI Updated Event Published");
};