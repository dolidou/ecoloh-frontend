import { useState } from 'react';

export default function AdminStatistics() {
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  return (
    <div>
      <h2 className="section-title">📊 Statistiques Avancées</h2>

      <div style={{ marginBottom: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div className="form-group">
          <label>Événement</label>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            <option value="all">Tous les événements</option>
            <option value="algerassic">Algerassic Parc</option>
            <option value="football">Football Tournament</option>
            <option value="summer">Summer Night Swim</option>
          </select>
        </div>
        <div className="form-group">
          <label>Période</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="year">Année</option>
          </select>
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <button className="btn-submit">Filtrer</button>
        </div>
      </div>

      {/* Stats en ligne */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">💼 Taux de Conversion</div>
          <div className="stat-value">68%</div>
          <div className="stat-change">↑ +5% vs période précédente</div>
        </div>
        <div className="stat-card primary">
          <div className="stat-label">💳 Moyenne par Ticket</div>
          <div className="stat-value">1,950 DA</div>
          <div className="stat-change">Stabil vs période précédente</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">⏱️ Ticket Moyen</div>
          <div className="stat-value">2.3 pers</div>
          <div className="stat-change">Packs = bon engagement</div>
        </div>
      </div>

      {/* Comparaison Événements */}
      <div className="chart-container">
        <h3 className="chart-title">📊 Revenus par Événement</h3>
        <div className="bar-chart">
          <div className="bar" style={{ height: '100%' }}>
            <div className="bar-value">85K</div>
            <div className="bar-label">Algerassic</div>
          </div>
          <div className="bar" style={{ height: '65%' }}>
            <div className="bar-value">55K</div>
            <div className="bar-label">Football</div>
          </div>
          <div className="bar" style={{ height: '40%' }}>
            <div className="bar-value">34K</div>
            <div className="bar-label">Summer</div>
          </div>
          <div className="bar" style={{ height: '25%' }}>
            <div className="bar-value">21K</div>
            <div className="bar-label">Ateliers</div>
          </div>
        </div>
      </div>

      {/* Export */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button className="btn-submit" onClick={() => alert('📥 Export PDF en développement')}>
          📥 Exporter en PDF
        </button>
        <button className="btn-submit" style={{ background: '#3498db' }} onClick={() => alert('📊 Export CSV en développement')}>
          📊 Exporter en CSV
        </button>
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

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
