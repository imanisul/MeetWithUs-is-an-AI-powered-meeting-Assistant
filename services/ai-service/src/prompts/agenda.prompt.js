export const buildAgentPrompt = (meeting) => {
    return `
        You are an expert meeting planner.

Generate the following:

1. Meeting Agenda
2. Discussion Points
3. Action Items

Meeting Title:
${meeting.title}

Meeting Description:
${meeting.description}

Respond in clean Markdown.
`;
};