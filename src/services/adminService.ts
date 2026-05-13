import api from './api';

export interface DashboardStats {
  summary: {
    total_revenue: number;
    tickets_sold: number;
    active_events: number;
    open_complaints: number;
    revenue_this_week: number;
    tickets_today: number;
    critical_complaints: number;
  };
  revenue_by_day: Record<string, number>;
  latest_tickets: Array<{
    code: string;
    event: string;
    user: string;
    amount: string;
    status: string;
    date: string;
  }>;
}

export interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  max_capacity: number;
  price?: number;
  has_child_pricing?: boolean;
  child_price?: number;
  is_featured?: boolean;
  status?: 'draft' | 'active' | 'inactive' | 'cancelled';
  theme?: {
    preset?: 'default' | 'algerassic' | 'space' | 'drift' | 'other';
    color_primary?: string;
    color_secondary?: string;
    color_accent?: string;
    color_text?: string;
    gradient_start?: string;
    gradient_end?: string;
    background_image_url?: string;
    header_image_url?: string;
  };
  ticket_types?: Array<{
    name: string;
    description?: string;
    price: number;
    quantity?: number;
  }>;
  form_fields?: Array<{
    field_name: string;
    field_type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
    field_label: string;
    is_required?: boolean;
    display_order?: number;
  }>;
}

const adminService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  // Get all events (admin)
  getEvents: async (params?: { status?: string; search?: string; page?: number }) => {
    const response = await api.get('/admin/events', { params });
    return response.data;
  },

  // Create event
  createEvent: async (data: EventFormData) => {
    const response = await api.post('/admin/events', data);
    return response.data;
  },

  // Update event
  updateEvent: async (id: number, data: Partial<EventFormData>) => {
    const response = await api.put(`/admin/events/${id}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: number) => {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  },
};

export default adminService;
