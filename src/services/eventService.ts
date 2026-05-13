import api from './api';

const eventService = {
  // Get featured/active events (public)
  getFeaturedEvents: async () => {
    const response = await api.get('/events/featured');
    return response.data;
  },

  // Get all active events (public)
  getActiveEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get single event detail (public)
  getEvent: async (id: number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
