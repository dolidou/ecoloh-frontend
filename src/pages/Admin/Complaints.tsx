import { useState } from 'react';

export default function AdminComplaints() {
  const [showModal, setShowModal] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const allComplaints = [
    { id: '#001', category: 'Ticket Perdu', subject: "N'ai pas reçu mon ticket Algerassic", email: 'ahmed@email.com', priority: '🔴 Critique', status: 'Ouvert', date: '2025-05-04' },
    { id: '#002', category: 'Paiement Non Validé', subject: 'Débité mais pas de ticket reçu', email: 'sara@email.com', priority: '🔴 Critique', status: 'En cours', date: '2025-05-03' },
    { id: '#003', category: 'Autre', subject: 'QR code ne scanne pas correctement', email: 'fatima@email.com', priority: '🟡 Moyen', status: 'En cours', date: '2025-05-02' },
    { id: '#004', category: 'Paiement Validé Sans Ticket', subject: 'Paiement OK mais ticket dupliqué', email: 'mohammad@email.com', priority: '🟡 Moyen', status: 'Résolu', date: '2025-05-01' },
    { id: '#005', category: 'Ticket Perdu', subject: 'Code de récupération perdu', email: 'john@email.com', priority: '🟢 Bas', status: 'Résolu', date: '2025-04-30' },
  ];

  let filteredComplaints = allComplaints.filter(complaint =>
    (complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || complaint.status === statusFilter)
  );

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Ouvert') return 'badge-danger';
    if (status === 'En cours') return 'badge-info';
    if (status === 'Résolu') return 'badge-success';
    return 'badge-success';
  };

  return (
    <div>
      <h2 className="section-title">📋 Gestion des Réclamations</h2>

      <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        <div className="form-group">
          <label>🔍 Rechercher</label>
          <input
            type="text"
            placeholder="Email, sujet, catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Filtrer par statut</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="Ouvert">Ouvert</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Réclamations Ouvertes</h3>
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
            </select>
            <span style={{ fontWeight: 600 }}>entries</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '1200px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Catégorie</th>
                <th>Sujet</th>
                <th>Email</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.slice(0, entriesPerPage).map((complaint) => (
                <tr key={complaint.id}>
                  <td><strong>{complaint.id}</strong></td>
                  <td>{complaint.category}</td>
                  <td>{complaint.subject}</td>
                  <td>{complaint.email}</td>
                  <td>{complaint.priority}</td>
                  <td><span className={`badge ${getStatusBadgeClass(complaint.status)}`}>{complaint.status}</span></td>
                  <td>{complaint.date}</td>
                  <td><button className="btn-small" onClick={() => setShowModal(true)}>Traiter</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            Showing 1 to {Math.min(entriesPerPage, filteredComplaints.length)} of {filteredComplaints.length} entries
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="paginate-btn" disabled>Previous</button>
            <button className="paginate-btn active">1</button>
            <button className="paginate-btn" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modal Réclamation */}
      {showModal && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Traiter Réclamation</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ margin: '0 0 10px 0' }}><strong>Email:</strong> ahmed@email.com</p>
              <p style={{ margin: '0 0 10px 0' }}><strong>Catégorie:</strong> Ticket Perdu</p>
              <p style={{ margin: '0' }}><strong>Message:</strong> N'ai pas reçu mon ticket Algerassic, débité mais rien reçu</p>
            </div>
            <form>
              <div className="form-group">
                <label>Action</label>
                <select>
                  <option>-- Choisir une action --</option>
                  <option>Renvoyer le ticket</option>
                  <option>Remboursement</option>
                  <option>Crédits de fidélité</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes Admin</label>
                <textarea placeholder="Notes internes..." rows={4}></textarea>
              </div>
              <button
                type="button"
                className="btn-submit"
                onClick={() => {
                  alert('Réclamation traitée!');
                  setShowModal(false);
                }}
              >
                Valider Action
              </button>
            </form>
          </div>
        </div>
      )}

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

        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal.active {
          display: flex;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: var(--radius);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .btn-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #7f8c8d;
        }

        .btn-close:hover {
          color: var(--text);
        }

        .btn-submit {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          width: 100%;
          margin-top: 10px;
        }

        .btn-submit:hover {
          background: #27ae60;
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
