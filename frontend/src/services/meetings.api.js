import api from './api';

export const meetingsApi = {
  createMeeting: async (meetingData) => {
    const { data } = await api.post('/meetings', meetingData);
    return data;
  },
  getMeetings: async () => {
    const { data } = await api.get('/meetings');
    return data;
  },
  getMeetingById: async (id) => {
    const { data } = await api.get(`/meetings/${id}`);
    return data;
  },
  updateMeeting: async (id, updateData) => {
    const { data } = await api.patch(`/meetings/${id}`, updateData);
    return data;
  },
  deleteMeeting: async (id) => {
    const { data } = await api.delete(`/meetings/${id}`);
    return data;
  },
  getAnalytics: async () => {
    const { data } = await api.get('/meetings/analytics');
    return data;
  }
};
