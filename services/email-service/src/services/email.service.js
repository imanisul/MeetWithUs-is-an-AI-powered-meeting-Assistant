import { transporter } from '../config/mail.js';

export const sentMeetingInvitation = async (meeting) => {
    for(const attendee of meeting.attendees){
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: attendee.email,
            subject: `Meeting Invitation - ${meeting.title}`,

            html: `
                <h2>${meeting.title}</h2>

                <p>${meeting.description}</p>

                <a href="${meeting.meetingLink}">
                    Join Meeting
                </a>    
            `,

        });

        console.log(`Invitation sent to ${attendee.email}`);
        


    }
}