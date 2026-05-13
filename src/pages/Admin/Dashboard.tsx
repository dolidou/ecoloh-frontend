import { useEffect, useState, useCallback } from 'react';
import adminService, { DashboardStats } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
      setError(null);
    ) catch (_) {
      setError('Erreur lors du chargement des statistiques');
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

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
        <button onClick={loadStats} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare revenue by day chart data
  // const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const revenueData = Object.entries(stats.revenue_by_day).map(([date, revenue]) => ({
    date,
    revenue,
    day: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })
  }));

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  return (
    <div>
      <h2 className="section-title">📈 Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">💰 Revenus Totaux</div>
          <div className="stat-value">{stats.summary.total_revenue.toLocaleString()} DA</div>
          <div className="stat-change">
            ↑ +{stats.summary.revenue_this_week.toLocaleString()} DA cette semaine
          </div>
        </div>
        <div className="stat-card primary">
          <div className="stat-label">🎟️ Tickets Vendus</div>
          <div className="stat-value">{stats.summary.tickets_sold.toLocaleString()}</div>
          <div className="stat-change">↑ +{stats.summary.tickets_today} aujourd'hui</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">🎪 Événements Actifs</div>
          <div className="stat-value">{stats.summary.active_events}</div>
          <div className="stat-change">Événements publiés</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">⚠️ Réclamations Ouvertes</div>
          <div className="stat-value">{stats.summary.open_complaints}</div>
          <div className="stat-change negative">
            {stats.summary.critical_complaints} critiques
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <h3 className="chart-title">📊 Revenus par Jour (7 derniers jours)</h3>
        <div className="bar-chart">
          {revenueData.map((data, idx) => {
            const height = (data.revenue / maxRevenue) * 100;
            return (
              <div key={idx} className="bar" style={{ height: `${height}%` }}>
                <div className="bar-value">{(data.revenue / 1000).toFixed(0)}K</div>
                <div className="bar-label">{data.day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Tickets Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">🎟️ Derniers Tickets</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '1000px' }}>
            <thead>
              <tr>
                <th>Code Ticket</th>
                <th>Événement</th>
                <th>Utilisateur</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.latest_tickets.map((ticket, idx) => (
                <tr key={idx}>
                  <td>{ticket.code}</td>
                  <td>{ticket.event}</td>
                  <td>{ticket.user}</td>
                  <td>{ticket.amount}</td>
                  <td>
                    <span className={`badge badge-${ticket.status === 'paid' ? 'success' : ticket.status === 'pending' ? 'pending' : 'info'}`}>
                      {ticket.status === 'paid' ? 'Payé' : ticket.status === 'pending' ? 'En attente' : 'Utilisé'}
                    </span>
                  </td>
                  <td>{ticket.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          font-weight: 700;
          color: var(--text);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .stat-card.primary {
          border-left: 4px solid var(--primary);
        }

        .stat-card.danger {
          border-left: 4px solid #e74c3c;
        }

        .stat-card.accent {
          border-left: 4px solid #f1c40f;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .stat-change {
          font-size: 0.85rem;
          color: var(--primary);
        }

        .stat-change.negative {
          color: #e74c3c;
        }

        .chart-container {
          background: var(--card-bg);
          padding: 20px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          margin-bottom: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .chart-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 15px;
          margin-top: 0;
        }

        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 250px;
          gap: 20px;
        }

        .bar {
          flex: 1;
          background: linear-gradient(180deg, var(--primary) 0%, #27ae60 100%);
          border-radius: 8px 8px 0 0;
          position: relative;
          min-height: 30px;
        }

        .bar-label {
          position: absolute;
          bottom: -25px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .bar-value {
          position: absolute;
          top: -25px;
          left: 0;
          right: 0;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .table-container {
          background: var(--card-bg);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          overflow: hidden;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .table-header {
          padding: 15px 25px;
          background: #f8f9fa;
          border-bottom: 1px solid var(--border);
        }

        .table-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          color: var(--text);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f8f9fa;
        }

        th {
          padding: 12px;
          text-align: left;
          font-weight: 700;
          font-size: 0.9rem;
          color: #7f8c8d;
          border-bottom: 2px solid var(--border);
        }

        td {
          padding: 12px;
          border-bottom: 1px solid var(--border);
        }

        tbody tr:hover {
          background: #f8f9fa;
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

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
        }
      `}</style>
    </div>
  );
}
