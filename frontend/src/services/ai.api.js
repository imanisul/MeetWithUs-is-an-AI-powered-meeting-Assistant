import api from './api';

export const aiApi = {
  generateAgenda: async (meetingData) => {
    const { data } = await api.post('/ai/generate-agenda', meetingData);
    return data;
  },
  generateSummary: async (meetingData) => {
    const { data } = await api.post('/ai/generate-summary', meetingData);
    return data;
  },
  generateActionItems: async (meetingData) => {
    const { data } = await api.post('/ai/generate-action-items', meetingData);
    return data;
  },
  searchKnowledgeBase: async (query) => {
    const { data } = await api.get(`/ai/search?q=${encodeURIComponent(query)}`);
    return data;
  }
};
