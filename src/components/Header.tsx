import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="logo-ecoloh text-3xl">ECOLOH</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  Bienvenue, <strong style={{ color: 'var(--primary)' }}>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{ background: '#e74c3c', color: 'white', border: 'none' }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
