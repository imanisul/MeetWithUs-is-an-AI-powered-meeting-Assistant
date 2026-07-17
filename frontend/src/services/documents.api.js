import api from './api';

export const documentsApi = {
  uploadDocument: async (formData) => {
    const { data } = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },
  getDocuments: async () => {
    const { data } = await api.get('/documents');
    return data;
  },
  deleteDocument: async (id) => {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  },
  addDocumentAccess: async (id, data) => {
    const { data: response } = await api.post(`/documents/${id}/access`, data);
    return response;
  },
  removeDocumentAccess: async (id, email) => {
    const { data } = await api.delete(`/documents/${id}/access/${encodeURIComponent(email)}`);
    return data;
  }
};
