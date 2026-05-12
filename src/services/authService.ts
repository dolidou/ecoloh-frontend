import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
