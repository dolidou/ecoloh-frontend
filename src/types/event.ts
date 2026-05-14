export interface EventTheme {
  id: number;
  event_id: number;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  start_date: string;
  end_date: string;
  location: string;
  total_capacity: number;
  status: string;
  featured: boolean;
  theme: EventTheme | null;
  ticket_types: TicketType[];
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
  meta?: {
    current_page: number;
    total: number;
    per_page: number;
  };
}

export interface EventDetailResponse {
  success: boolean;
  data: Event;
}
