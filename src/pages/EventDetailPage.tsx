import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { Event, TicketType } from '../types/event';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem, getTotalPrice, getTotalItems, items } = useCartStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const loadEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      const response = await eventService.getEvent(eventId);
      setEvent(response.data?.data || null);
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Événement introuvable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadEvent(parseInt(id));
    }
  }, [id, loadEvent]);

  const handleQuantityChange = (ticketTypeId: number, value: number) => {
    setQuantities({
      ...quantities,
      [ticketTypeId]: Math.max(0, value),
    });
  };

  const handleAddToCart = (ticketType: TicketType) => {
    const quantity = quantities[ticketType.id] || 0;
    if (quantity > 0 && event) {
      addItem(
        {
          ticketTypeId: ticketType.id,
          ticketTypeName: ticketType.name,
          price: ticketType.price,
          quantity,
        },
        event.id,
        event.title
      );
      setQuantities({ ...quantities, [ticketType.id]: 0 });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    alert('Checkout en développement - Total: ' + getTotalPrice() + ' DA');
  };

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

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-glass text-center">
          <p style={{ color: '#e74c3c' }}>{error}</p>
          <button onClick={() => navigate('/events')} className="btn-primary mt-4">
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/events')} className="btn-secondary mb-6">
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Info */}
          <div className="card-glass animate-fade-in" style={{ borderColor: event.theme?.primary_color, borderWidth: '2px' }}>
            {event.cover_image && (
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}
            <h1 className="text-4xl font-bold mb-4" style={{ color: event.theme?.primary_color || 'var(--text)' }}>
              {event.title}
            </h1>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '24px' }}>📍</span>
                <span style={{ color: 'var(--text)', opacity: 0.8 }}>{event.location}</span>
              </div>
              {event.start_date && (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '24px' }}>📅</span>
                  <span style={{ color: 'var(--text)', opacity: 0.8 }}>
                    {new Date(event.start_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {!!event.total_capacity && (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '24px' }}>👥</span>
                  <span style={{ color: 'var(--text)', opacity: 0.8 }}>
                    Capacité: {event.total_capacity} personnes
                  </span>
                </div>
              )}
            </div>
            <p className="text-lg" style={{ color: 'var(--text)', opacity: 0.7 }}>
              {event.description}
            </p>
          </div>

          {/* Booking Form */}
          <div className="card-glass animate-fade-in" style={{ borderColor: event.theme?.secondary_color, borderWidth: '2px' }}>
            <h2 className="text-3xl font-bold mb-6" style={{ color: event.theme?.primary_color || 'var(--text)' }}>
              Réserver vos tickets
            </h2>

            <div className="space-y-4 mb-6">
              {event.ticket_types.map((ticketType) => (
                <div
                  key={ticketType.id}
                  className="card-glass"
                  style={{
                    background: `${event.theme?.primary_color}10`,
                    padding: '20px',
                    borderColor: event.theme?.secondary_color,
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: event.theme?.primary_color || 'var(--text)' }}>
                        {ticketType.name}
                      </h3>
                      {ticketType.description && (
                        <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.6 }}>
                          {ticketType.description}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl font-bold" style={{ color: event.theme?.primary_color || 'var(--primary)' }}>
                      {ticketType.price} DA
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={quantities[ticketType.id] || 0}
                      onChange={(e) => handleQuantityChange(ticketType.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                      placeholder="0"
                    />
                    <button
                      onClick={() => handleAddToCart(ticketType)}
                      disabled={!quantities[ticketType.id] || quantities[ticketType.id] <= 0}
                      className="btn-primary flex-1"
                      style={{
                        background: event.theme?.primary_color || 'var(--primary)',
                        opacity: quantities[ticketType.id] > 0 ? 1 : 0.5,
                      }}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div
                className="card-glass"
                style={{
                  background: `${event.theme?.primary_color}15`,
                  border: `2px solid ${event.theme?.primary_color || 'var(--primary)'}`,
                }}
              >
                <h3 className="text-2xl font-bold mb-4" style={{ color: event.theme?.primary_color || 'var(--text)' }}>
                  Panier ({getTotalItems()} tickets)
                </h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.ticketTypeId} className="flex justify-between">
                      <span style={{ color: 'var(--text)' }}>
                        {item.quantity}x {item.ticketTypeName}
                      </span>
                      <span style={{ color: event.theme?.primary_color || 'var(--text)', fontWeight: 'bold' }}>
                        {parseFloat(item.price) * item.quantity} DA
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="border-t pt-4 mb-4"
                  style={{ borderColor: event.theme?.primary_color || 'var(--primary)' }}
                >
                  <div className="flex justify-between text-2xl font-bold">
                    <span style={{ color: 'var(--text)' }}>Total:</span>
                    <span style={{ color: event.theme?.primary_color || 'var(--primary)' }}>{getTotalPrice()} DA</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full"
                  style={{ background: event.theme?.primary_color || 'var(--primary)' }}
                >
                  Procéder au paiement →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
