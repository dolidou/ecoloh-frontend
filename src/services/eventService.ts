import api from './api';
import { EventsResponse, EventDetailResponse } from '../types/event';

export const eventService = {
  getAll: async (): Promise<EventsResponse> => {
    const response = await api.get('/events');
    return response.data;
  },

  getById: async (id: number): Promise<EventDetailResponse> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<EventsResponse> => {
    const response = await api.get('/events/search', {
      params: { q: query },
    });
    return response.data;
  },
};
