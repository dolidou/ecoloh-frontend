import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(15px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-ecoloh.png"
              alt="Logo ECOLOH"
              style={{
                height: "60px",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
              }}
            />
            <h1 className="logo-ecoloh" style={{ fontSize: "2rem" }}></h1>
          </Link>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              padding: "10px 20px",
              borderRadius: "30px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {isAuthenticated ? (
              <>
                <span style={{ color: "var(--text)", fontWeight: 600 }}>
                  Bienvenue,{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    {user?.name}
                  </strong>
                </span>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    📊 Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: "var(--text)",
                    textDecoration: "none",
                    fontWeight: 600,
                    padding: "8px 20px",
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "8px 20px",
                  }}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
