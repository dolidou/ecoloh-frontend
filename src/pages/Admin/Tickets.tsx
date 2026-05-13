import { useState } from 'react';

export default function AdminTickets() {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const allTickets = [
    { code: 'TKT-001254', event: 'Algerassic Parc', email: 'ahmed@email.com', qty: '4 (Pack Famille)', amount: '3,500 DA', status: 'Payé', used: '❌' },
    { code: 'TKT-001253', event: 'Football', email: 'fatima@email.com', qty: '1 (Adulte)', amount: '800 DA', status: 'Payé', used: '✅ 2025-05-04' },
    { code: 'TKT-001252', event: 'Atelier Jardinage', email: 'contact@email.com', qty: '1 (Gratuit)', amount: 'Gratuit', status: 'Utilisé', used: '✅ 2025-05-03' },
    { code: 'TKT-001251', event: 'Summer Swim', email: 'sara@email.com', qty: '2 (Adulte+Enfant)', amount: '5,000 DA', status: 'En attente', used: '❌' },
    { code: 'TKT-001250', event: 'Football', email: '-', qty: '1 (Adulte)', amount: '800 DA', status: 'Échoué', used: '❌' },
    { code: 'TKT-001249', event: 'Algerassic Parc', email: 'john@email.com', qty: '2 (Enfant)', amount: '1,600 DA', status: 'Payé', used: '✅ 2025-05-02' },
    { code: 'TKT-001248', event: 'Summer Swim', email: 'maria@email.com', qty: '6 (Pack Groupe)', amount: '5,000 DA', status: 'Payé', used: '❌' },
    { code: 'TKT-001247', event: 'Atelier Recyclage', email: 'eco@email.com', qty: '1 (Gratuit)', amount: 'Gratuit', status: 'Payé', used: '✅ 2025-05-01' },
    { code: 'TKT-001246', event: 'Football', email: 'sport@email.com', qty: '3 (Adulte)', amount: '2,400 DA', status: 'Payé', used: '✅ 2025-04-30' },
    { code: 'TKT-001245', event: 'Algerassic Parc', email: 'family@email.com', qty: '4 (Pack Famille)', amount: '3,500 DA', status: 'En attente', used: '❌' },
  ];

  let filteredTickets = allTickets.filter(ticket =>
    (ticket.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.event.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || ticket.status === statusFilter)
  );

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Payé') return 'badge-success';
    if (status === 'En attente') return 'badge-pending';
    if (status === 'Utilisé') return 'badge-info';
    if (status === 'Échoué') return 'badge-danger';
    return 'badge-success';
  };

  return (
    <div>
      <h2 className="section-title">🎟️ Gestion des Tickets</h2>

      <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        <div className="form-group">
          <label>🔍 Rechercher</label>
          <input
            type="text"
            placeholder="Code, email, événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Filtrer par statut</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
            <option value="Utilisé">Utilisé</option>
            <option value="Échoué">Échoué</option>
          </select>
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <button className="btn-submit" onClick={() => alert('📥 Export PDF/CSV en développement')}>
            📥 Exporter
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Tous les Tickets</h3>
        </div>

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
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '1200px' }}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Événement</th>
                <th>Email</th>
                <th>Quantité</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Utilisé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.slice(0, entriesPerPage).map((ticket) => (
                <tr key={ticket.code}>
                  <td><strong>{ticket.code}</strong></td>
                  <td>{ticket.event}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.qty}</td>
                  <td>{ticket.amount}</td>
                  <td><span className={`badge ${getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span></td>
                  <td>{ticket.used}</td>
                  <td><button className="btn-small">Voir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            Showing 1 to {Math.min(entriesPerPage, filteredTickets.length)} of {filteredTickets.length} entries
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
        .form-group select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .btn-submit {
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

        .btn-submit:hover {
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

        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
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
