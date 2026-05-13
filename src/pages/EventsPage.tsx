import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import { Event } from '../types/event';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventService.getActiveEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}></div>
          <p style={{ color: 'var(--text)' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-glass text-center">
          <p style={{ color: '#e74c3c' }}>{error}</p>
          <button onClick={loadEvents} className="btn-primary mt-4">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Nos Événements
          </h1>
          <p className="text-xl" style={{ color: 'var(--text)', opacity: 0.7 }}>
            Découvrez tous nos événements et réservez vos tickets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="card-glass hover:scale-105 transition-transform" style={{ textDecoration: 'none' }}>
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.name || 'Événement'}
                  className="w-full h-48 object-cover rounded-t-2xl mb-4"
                />
              )}
              <div className="p-4">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {event.name || 'Événement'}
                </h3>
                <p className="mb-3" style={{ color: 'var(--text)', opacity: 0.7 }}>
                  {event.description.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text)', opacity: 0.6 }}>
                    📍 {event.location}
                  </span>
                  {event.ticket_types.length > 0 && (
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>
                      À partir de {event.ticket_types[0].price} DA
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center card-glass">
            <p style={{ color: 'var(--text)' }}>Aucun événement disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
