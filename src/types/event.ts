export interface EventTheme {
  id: number;
  name: string;
  color: string | null;
}

export interface TicketType {
  id: number;
  name: string;
  price: string;
  quantity_available: number | null;
  quantity_sold: number;
  description: string | null;
}

export interface Event {
  id: number;
  name: string | null;
  description: string;
  date: string | null;
  location: string;
  image_url: string | null;
  capacity: number | null;
  status: string;
  themes: EventTheme[];
  ticket_types: TicketType[];
  created_at: string;
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
