import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

interface EventData {
  id: number;
  title: string;
  description: string;
  location?: string;
  start_date?: string;
  total_capacity?: number;
  status?: string;
  featured?: boolean;
}

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getEvents();
      setEvents(response.data.data || []);
      setError(null);
    ) catch (_) {
      setError('Erreur lors du chargement des événements');
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '1.5rem' }}>⏳ Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '1.5rem', color: '#e74c3c' }}>❌ {error}</div>
        <button onClick={loadEvents} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">🎪 Gestion des Événements</h2>

      <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        <div className="form-group">
          <label>🔍 Rechercher</label>
          <input
            type="text"
            placeholder="Titre, type, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <button className="btn-add" onClick={() => navigate('/admin/events/create')}>
            + Nouvel Événement
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Tous les Événements</h3>
        </div>

        {/* DataTable Controls */}
        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600 }}>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span style={{ fontWeight: 600 }}>entries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600 }}>Search:</span>
            <input
              type="text"
              placeholder="Rechercher..."
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', width: '200px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '1000px' }}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Lieu</th>
                <th>Types de tickets</th>
                <th>Date</th>
                <th>Capacité</th>
                <th>Statut</th>
                <th>À la Une</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.slice(0, entriesPerPage).map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{event.location || 'N/A'}</td>
                  <td>Voir types</td>
                  <td>{event.start_date ? new Date(event.start_date).toLocaleDateString('fr-FR') : 'N/A'}</td>
                  <td>{event.total_capacity}</td>
                  <td>
                    <span className={`badge ${
                      event.status === 'active' ? 'badge-success' :
                      event.status === 'draft' ? 'badge-pending' :
                      'badge-info'
                    }`}>
                      {event.status === 'active' ? 'Actif' :
                       event.status === 'draft' ? 'Brouillon' :
                       event.status === 'inactive' ? 'Inactif' :
                       'Annulé'}
                    </span>
                  </td>
                  <td>{event.featured ? '✅ Oui' : '❌ Non'}</td>
                  <td><button className="btn-small">Éditer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            Showing 1 to {Math.min(entriesPerPage, filteredEvents.length)} of {filteredEvents.length} entries
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="paginate-btn" disabled>Previous</button>
            <button className="paginate-btn active">1</button>
            <button className="paginate-btn" disabled>Next</button>
          </div>
        </div>
      </div>

      <style>{`
        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .btn-add {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          width: 100%;
        }

        .btn-add:hover {
          background: #27ae60;
        }

        .btn-small {
          background: transparent;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: #555;
          text-decoration: none;
        }

        .btn-small:hover {
          color: var(--primary);
        }

        .paginate-btn {
          padding: 8px 12px;
          margin: 0 3px;
          border: 1px solid var(--border);
          background: white;
          color: var(--text);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .paginate-btn:hover:not(:disabled) {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .paginate-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .paginate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-success {
          background: #d4edda;
          color: #155724;
        }

        .badge-pending {
          background: #fff3cd;
          color: #856404;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text);
        }

        .table-container {
          background: var(--card-bg);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .table-header {
          padding: 15px 25px;
          border-bottom: 1px solid var(--border);
        }

        .table-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          color: var(--text);
        }

        table {
          border-collapse: collapse;
        }

        table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 2px solid var(--border);
        }

        table td {
          padding: 12px;
          border-bottom: 1px solid var(--border);
        }

        table tbody tr:hover {
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
