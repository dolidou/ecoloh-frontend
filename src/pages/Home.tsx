import { useAuthStore } from "../stores/authStore";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/logo-ecoloh.png"
              alt="Logo ECOLOH"
              style={{
                height: "90px",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
              }}
            />
            <h1 className="logo-ecoloh text-6xl"></h1>
          </div>
          <p
            className="text-2xl mb-8"
            style={{ color: "var(--text)", opacity: 0.8 }}
          >
            Bienvenue sur la plateforme de billetterie centralisée
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Se connecter →
            </a>
            <a
              href="/events"
              className="btn-secondary"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Voir les événements
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-glass animate-fade-in">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Bienvenue {user?.name}! 👋
          </h1>
          <p
            className="text-xl mb-8"
            style={{ color: "var(--text)", opacity: 0.7 }}
          >
            Vous êtes connecté en tant que{" "}
            <strong
              style={{ color: "var(--primary)", textTransform: "uppercase" }}
            >
              {user?.role}
            </strong>
          </p>

          <div
            className="card-glass"
            style={{ background: "rgba(255, 255, 255, 0.5)" }}
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              Prochaines étapes
            </h2>
            <ul
              className="space-y-3 text-lg"
              style={{ color: "var(--text)", opacity: 0.8 }}
            >
              <li className="flex items-start">
                <span
                  style={{
                    color: "var(--primary)",
                    marginRight: "10px",
                    fontSize: "24px",
                  }}
                >
                  🎫
                </span>
                Découvrez nos événements disponibles
              </li>
              <li className="flex items-start">
                <span
                  style={{
                    color: "var(--primary)",
                    marginRight: "10px",
                    fontSize: "24px",
                  }}
                >
                  ✨
                </span>
                Réservez vos tickets favoris
              </li>
              <li className="flex items-start">
                <span
                  style={{
                    color: "var(--primary)",
                    marginRight: "10px",
                    fontSize: "24px",
                  }}
                >
                  💳
                </span>
                Effectuez votre paiement via SATIM
              </li>
              <li className="flex items-start">
                <span
                  style={{
                    color: "var(--primary)",
                    marginRight: "10px",
                    fontSize: "24px",
                  }}
                >
                  📧
                </span>
                Recevez vos tickets par email avec code QR
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
