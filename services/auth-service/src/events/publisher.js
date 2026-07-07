import { getChannel } from '../config/rabbitmq.js';

export const publishOrganizationInvite = async (inviteData) => {
    const channel = getChannel();
    if (!channel) {
        console.warn("RabbitMQ channel not available, skipping event publish");
        return;
    }

    const queue = 'organization-invite-created';

    await channel.assertQueue(queue);

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(inviteData))
    );

    console.log("Auth Service: OrganizationInviteCreated event published");
};
