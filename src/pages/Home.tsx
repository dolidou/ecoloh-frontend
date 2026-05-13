import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import eventService from '../services/eventService';

interface ContentItem {
  t: string;
  p: number | string;
  d: string;
}

interface ThemeConfig {
  title: string;
  desc: string;
  bgImage: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  theme?: {
    banner_url?: string;
  };
  ticket_types?: Array<{
    id: number;
    name: string;
    price: number;
    description?: string;
  }>;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedItem, setSelectedItem] = useState('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [currentItemType, setCurrentItemType] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const loadFeaturedEvents = useCallback(async () => {
    try {
      const response = await eventService.getFeaturedEvents();
      if (response.data && response.data.length > 0) {
        setFeaturedEvents(response.data);
        setSelectedEvent(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading featured events:', error);
    }
  }, []);

  useEffect(() => {
    loadFeaturedEvents();
  }, [loadFeaturedEvents]);

  const contentData: Record<string, ContentItem[]> = {
    default: [
      { t: '⚽ Football', p: 800, d: 'Terrain 5x5 synthétique' },
      { t: '🎾 Tennis', p: 800, d: 'Terre battue / Quick' },
      { t: '🏀 Basket', p: 500, d: 'Terrain extérieur pro' }
    ],
    algerassic: [
      { t: 'Pass Explorateur', p: 'dynamic', d: 'Tickets individuels Adulte/Enfant' },
      { t: 'Clan des Dinos', p: 1000, d: 'Pack Famille (4 pers)' }
    ],
    space: [
      { t: 'Billet Astronaute', p: 'dynamic', d: 'Tickets individuels Adulte/Enfant' },
      { t: 'Équipage Spatial', p: 1000, d: 'Pack Groupe (4 pers)' }
    ],
    drift: [
      { t: 'Pass Drift', p: 800, d: 'Spectacle' },
      { t: 'VIP Pool Side', p: 5000, d: 'Table réservée' }
    ],
    other: [
      { t: '🌱 École de Jardinage', p: 0, d: 'Atelier pédagogique' },
      { t: '🎨 Atelier Recyclage', p: 0, d: 'Activités créatives gratuites' },
      { t: '📸 Concours Photo', p: 0, d: 'Exposition ECOLOH' }
    ]
  };

  const themes: Record<string, ThemeConfig> = {
    default: {
      title: 'SERVICES SPORTIFS',
      desc: 'Réservez vos terrains de sport.',
      bgImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200'
    },
    algerassic: {
      title: 'ALGERASSIC LAND',
      desc: 'Plongez dans l\'ère des dinosaures.',
      bgImage: 'https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?auto=format&fit=crop&q=80&w=1200'
    },
    space: {
      title: 'OBJECTIF ESPACE',
      desc: 'Une aventure intergalactique.',
      bgImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200'
    },
    drift: {
      title: 'DRIFT NIGHT',
      desc: 'Sensations fortes et show mécanique.',
      bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'
    },
    other: {
      title: 'ATELIERS ECOLOH',
      desc: 'Activités éducatives et environnementales.',
      bgImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200'
    }
  };

  const handleThemeChange = (theme: string): void => {
    setSelectedTheme(theme);
    setSelectedItem('');
    setCurrentItemType('');
  };

  const handleSelectItem = (item: ContentItem): void => {
    setSelectedItem(item.t);
    setCurrentItemType(item.p === 'dynamic' ? 'dynamic' : 'standard');
  };

  const getTotalPrice = (): number | string => {
    if (currentItemType === 'dynamic') {
      return (countAdult * 300) + (countChild * 200);
    }
    const item = contentData[selectedTheme]?.find((i: ContentItem) => i.t === selectedItem);
    if (item?.p === 'dynamic') return 'À partir de 200';
    return item?.p || 0;
  };

  const showSportFields = selectedTheme === 'default';
  const showTicketSelection = currentItemType === 'dynamic';

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, padding: 0, background: 'var(--bg-gradient)', backgroundAttachment: 'fixed', minHeight: '100vh', color: 'var(--text)', width: '100%', overflowX: 'hidden' }} data-theme={selectedTheme}>

      {/* News Ticker */}
      <section style={{
        background: '#1a1a1a',
        color: 'white',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        fontSize: '0.9rem',
        zIndex: 2000,
        width: '100%'
      }} aria-label="Événements à la une">
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'scroll-left 30s linear infinite'
        }}>
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{
                  padding: '0 40px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                aria-label={`Aller à ${event.title}`}
              >
                <span style={{ color: 'var(--primary)', marginRight: '10px' }}>🔥 NOUVEAU:</span>
                {event.title} - {new Date(event.start_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </button>
            ))
          ) : (
            <div style={{ padding: '0 40px', fontWeight: 600 }}>
              <span style={{ color: 'var(--primary)', marginRight: '10px' }}>🔥 NOUVEAU:</span> Découvrez nos événements à venir!
            </div>
          )}
        </div>
      </section>

      {/* Complaint Button */}
      <button
        onClick={() => setShowComplaintModal(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          fontWeight: 800,
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 10px 20px rgba(231,76,60,0.3)',
          fontSize: '1rem'
        }}
      >
        ⚠️ Réclamation
      </button>

      {/* Header avec image - Affiche l'événement sélectionné OU le thème */}
      <header style={{
        height: '400px',
        width: '100%',
        backgroundImage: selectedEvent?.theme?.banner_url
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${selectedEvent.theme.banner_url}')`
          : `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${themes[selectedTheme as keyof typeof themes].bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        clipPath: 'ellipse(150% 100% at 50% 0%)',
        color: 'white',
        position: 'relative',
        marginBottom: 0,
        transition: 'background-image 0.5s ease'
      }}>
        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '30px',
          zIndex: 1001
        }}>
          <img src="/logo-ecoloh.png" alt="Logo ECOLOH" style={{ height: '70px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div style="font-size: 2rem; font-weight: 800; color: white; text-shadow: 0 4px 6px rgba(0,0,0,0.3)">ECOLOH</div>';
          }} />
        </div>

        {/* User Bar - Change selon l'état de connexion */}
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          zIndex: 1001,
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  backdropFilter: 'blur(5px)',
                  fontSize: '0.9rem'
                }}
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  backdropFilter: 'blur(5px)',
                  fontSize: '0.9rem'
                }}
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                Bienvenue, <span style={{ color: 'var(--primary)' }}>{user?.name || 'Admin'}</span>
              </span>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    background: 'var(--primary)',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    backdropFilter: 'blur(5px)',
                    fontSize: '0.9rem'
                  }}
                >
                  🏛️ Admin
                </button>
              )}
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                style={{
                  background: '#e74c3c',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  backdropFilter: 'blur(5px)',
                  fontSize: '0.9rem'
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>

        {/* Header Content */}
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 10px 0' }}>
            {selectedEvent?.title || themes[selectedTheme as keyof typeof themes].title}
          </h1>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            {selectedEvent?.description || themes[selectedTheme as keyof typeof themes].desc}
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        maxWidth: '1100px',
        margin: '-80px auto 50px',
        padding: '0 20px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text)' }}>Étape 1 : Choisissez votre activité</h2>

        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {selectedEvent?.ticket_types && selectedEvent.ticket_types.length > 0 ? (
            selectedEvent.ticket_types.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleSelectItem({ t: ticket.name, p: ticket.price, d: ticket.description || '' })}
                style={{
                  background: 'var(--glass)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '25px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: selectedItem === ticket.name ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: selectedItem === ticket.name ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  color: 'var(--text)'
                }}
                aria-pressed={selectedItem === ticket.name}
              >
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>{ticket.name}</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '10px 0' }}>
                  {ticket.price === 0 ? 'GRATUIT' : `${ticket.price} DA`}
                </div>
                <p style={{ margin: 0, color: 'var(--text)' }}>{ticket.description || 'Type de ticket'}</p>
              </button>
            ))
          ) : (
            contentData[selectedTheme].map((item) => {
              const displayPrice = item.p === 'dynamic' ? 'À partir de 200' : (item.p === 0 ? 'GRATUIT' : `${item.p} DA`);
              return (
                <button
                  key={item.t}
                  onClick={() => handleSelectItem(item)}
                  style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '25px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: selectedItem === item.t ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transform: selectedItem === item.t ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    color: 'var(--text)'
                  }}
                  aria-pressed={selectedItem === item.t}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>{item.t}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '10px 0' }}>
                    {displayPrice}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text)' }}>{item.d}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Reservation Form */}
        <div style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'var(--text)'
        }}>
          <h2 style={{ marginTop: 0, color: 'var(--text)' }}>Étape 2 : Détails de la réservation</h2>

          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="selected-item" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Sélection actuelle</label>
            <input
              id="selected-item"
              type="text"
              value={selectedItem}
              readOnly
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                background: 'white',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {showTicketSelection && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '15px'
            }}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label htmlFor="count-adult" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Adulte (300 DA)</label>
                <input
                  id="count-adult"
                  type="number"
                  value={countAdult}
                  onChange={(e) => setCountAdult(parseInt(e.target.value) || 0)}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label htmlFor="count-child" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Enfant (200 DA)</label>
                <input
                  id="count-child"
                  type="number"
                  value={countChild}
                  onChange={(e) => setCountChild(parseInt(e.target.value) || 0)}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {showSportFields && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label htmlFor="event-date" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Date</label>
                <input
                  id="event-date"
                  type="date"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label htmlFor="event-time" style={{ display: 'block', marginBottom: '5px', fontWeight: 600, color: 'var(--text)' }}>Heure</label>
                <select id="event-time" style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  background: 'white',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}>
                  <option>17:00</option>
                  <option>19:00</option>
                </select>
              </div>
            </div>
          )}

          <button style={{
            width: '100%',
            padding: '15px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            textTransform: 'uppercase',
            marginTop: '10px',
            fontSize: '1rem'
          }}>
            Payer ({getTotalPrice()} DA)
          </button>
        </div>
      </main>

      {/* Theme Switcher */}
      <nav style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '8px',
        borderRadius: '50px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {[
          { key: 'default', label: '⚽ Sport' },
          { key: 'algerassic', label: '🦖 Dino' },
          { key: 'space', label: '🚀 Espace' },
          { key: 'drift', label: '🏎️ Drift' },
          { key: 'other', label: '🍃 Ateliers' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            style={{
              border: 'none',
              background: selectedTheme === key ? 'var(--primary)' : 'transparent',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '60px 20px 120px',
        marginTop: '80px',
        borderTop: '4px solid var(--primary)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <h4>EPIC ECOLOH</h4>
            <p>EPIC ECOLOH est un établissement public de wilaya chargé de la gestion et de la promotion de l'Oued El Harrach aménagé pour la wilaya d'Alger.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>📞 +213 (0) 23 922 831<br/>✉️ contact@ecoloh.dz</p>
          </div>
        </div>
      </footer>

      {/* Modal Réclamation */}
      {showComplaintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '500px',
            color: '#333'
          }}>
            <h3>Déposer une réclamation</h3>
            <textarea placeholder="Décrivez votre problème ici..." style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              marginBottom: '15px',
              minHeight: '120px',
              boxSizing: 'border-box'
            }} />
            <button
              onClick={() => setShowComplaintModal(false)}
              style={{
                width: '100%',
                padding: '15px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                marginBottom: '10px',
                fontSize: '1rem'
              }}
            >
              Envoyer
            </button>
            <button
              onClick={() => setShowComplaintModal(false)}
              style={{
                width: '100%',
                padding: '15px',
                background: '#7f8c8d',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --primary: #2ecc71;
          --secondary: #27ae60;
          --text: #1a1a1a;
          --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          --glass: rgba(255, 255, 255, 0.7);
        }

        [data-theme="algerassic"] {
          --primary: #e67e22;
          --secondary: #d35400;
          --text: #ffffff;
          --bg-gradient: linear-gradient(135deg, #2c3e50 0%, #000000 100%);
          --glass: rgba(255, 255, 255, 0.1);
        }

        [data-theme="space"] {
          --primary: #9b59b6;
          --secondary: #8e44ad;
          --text: #ffffff;
          --bg-gradient: linear-gradient(135deg, #0f0c29 0%, #302b63 100%);
          --glass: rgba(255, 255, 255, 0.05);
        }

        [data-theme="drift"] {
          --primary: #ff003c;
          --secondary: #1a1a1a;
          --text: #ffffff;
          --bg-gradient: linear-gradient(135deg, #000000 0%, #434343 100%);
          --glass: rgba(255, 255, 255, 0.05);
        }

        [data-theme="other"] {
          --primary: #16a085;
          --secondary: #1abc9c;
          --text: #1a1a1a;
          --bg-gradient: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
          --glass: rgba(255, 255, 255, 0.8);
        }

        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        * {
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        body {
          margin: 0;
          background: #f5f7fa;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
