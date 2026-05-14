import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/admin' },
    { id: 'events', icon: '🎪', label: 'Événements', path: '/admin/events' },
    { id: 'category-heroes', icon: '🎬', label: 'Héros & Catégories', path: '/admin/category-heroes' },
    { id: 'tickets', icon: '🎟️', label: 'Tickets', path: '/admin/tickets' },
    { id: 'complaints', icon: '📋', label: 'Réclamations', path: '/admin/complaints' },
    { id: 'statistics', icon: '📈', label: 'Statistiques', path: '/admin/statistics' },
  ];

  return (
    <div className="admin-body">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-admin">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>📊</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>ECOLOH</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>ADMIN</div>
            </div>
          </div>
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  navigate(item.path);
                }}
              >
                {item.icon} {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* TOP BAR */}
      <header className="top-bar">
        <h1 className="admin-title">Tableau de Bord ECOLOH</h1>
        <div className="admin-info">
          <div className="admin-user">
            <div className="name">{user?.name || 'Admin ECOLOH'}</div>
            <div className="role">{user?.role === 'admin' ? 'Super Admin' : 'Admin'}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">{children}</main>

      <style>{`
        .admin-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          background: #f5f7fa;
          color: #1a1a1a;
          display: grid;
          grid-template-columns: 250px 1fr;
          grid-template-rows: auto 1fr;
          min-height: 100vh;
        }

        .sidebar {
          grid-column: 1;
          grid-row: 1 / -1;
          background: #2c3e50;
          color: white;
          padding: 20px;
          position: fixed;
          height: 100vh;
          width: 250px;
          overflow-y: auto;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .logo-admin {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 30px;
          padding: 15px;
          text-align: center;
        }

        .nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-menu li {
          margin-bottom: 10px;
        }

        .nav-menu button {
          width: 100%;
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 12px 15px;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .nav-menu button:hover,
        .nav-menu button.active {
          background: var(--primary);
          color: white;
        }

        .top-bar {
          grid-column: 2;
          grid-row: 1;
          background: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .admin-info {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .admin-user {
          text-align: right;
          font-size: 0.9rem;
        }

        .admin-user .name {
          font-weight: 600;
        }

        .admin-user .role {
          color: #7f8c8d;
          font-size: 0.85rem;
        }

        .btn-logout {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .btn-logout:hover {
          background: #c0392b;
        }

        .main-content {
          grid-column: 2;
          grid-row: 2;
          padding: 30px;
          overflow-y: auto;
        }

        @media (max-width: 1024px) {
          .admin-body {
            grid-template-columns: 200px 1fr;
          }

          .sidebar {
            width: 200px;
          }
        }

        @media (max-width: 768px) {
          .admin-body {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: fixed;
            left: -250px;
            height: 100%;
            z-index: 999;
            width: 250px;
          }

          .sidebar.active {
            left: 0;
          }

          .main-content {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
}
