import { getChannel } from '../config/rabbitmq.js';
import { transporter } from '../config/mail.js';

export const consumeOrganizationEvents = async () => {
    const channel = getChannel();
    if (!channel) return;

    const queue = 'organization-invite-created';

    await channel.assertQueue(queue);

    channel.consume(queue, async (message) => {
        try {
            const data = JSON.parse(message.content.toString());

            console.log(`[Email Service] Sending Organization Invite to ${data.email}`);

            await transporter.sendMail({
                from: process.env.EMAIL_USER || 'hello@meetwithus.com',
                to: data.email,
                subject: `You've been invited to ${data.orgName} on MeetWithUs`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0f172a;">Welcome to ${data.orgName}!</h2>
                        <p style="color: #334155; font-size: 16px; line-height: 1.5;">
                            You have been added to the <strong>${data.orgName}</strong> workspace on MeetWithUs with the role of <strong>${data.role}</strong>.
                        </p>
                        <p style="color: #334155; font-size: 16px; line-height: 1.5;">
                            Log in to view your team's meetings, access AI summaries, and explore the document knowledge base.
                        </p>
                        <div style="margin-top: 30px;">
                            <a href="http://localhost:5173/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Now</a>
                        </div>
                    </div>
                `,
            });

            console.log(`[Email Service] Invite sent to ${data.email}`);
            channel.ack(message);
        } catch (error) {
            console.error("[Email Service] Failed to send organization invite", error);
            // In production, we might want to nack the message to retry later
            channel.ack(message); // Acking here to prevent infinite loop for MVP
        }
    });
};
