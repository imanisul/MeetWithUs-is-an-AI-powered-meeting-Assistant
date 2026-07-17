import api from './api';

export const organizationApi = {
  getOrganization: async () => {
    const { data } = await api.get('/auth/organization');
    return data;
  },
  updateOrganization: async (updateData) => {
    const { data } = await api.patch('/auth/organization', updateData);
    return data;
  },
  inviteMember: async (inviteData) => {
    const { data } = await api.post('/auth/organization/invite', inviteData);
    return data;
  },
  updateRole: async (roleData) => {
    const { data } = await api.put('/auth/organization/role', roleData);
    return data;
  }
};
