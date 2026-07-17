import api from './api';

export const usersApi = {
  getAllUsers: async () => {
    const { data } = await api.get('/auth/users');
    return data;
  },
  getUserById: async (id) => {
    const { data } = await api.get(`/auth/users/${id}`);
    return data;
  },
  updateUserRole: async (id, role) => {
    const { data } = await api.patch(`/auth/users/${id}/role`, { role });
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await api.delete(`/auth/users/${id}`);
    return data;
  },
};
