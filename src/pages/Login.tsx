import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login(formData);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message || "Identifiants incorrects");
      } else {
        setLocalError("Identifiants incorrects");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-lg" style={{ color: "var(--text)", opacity: 0.8 }}>
            Plateforme de Billetterie Centralisée
          </p>
        </div>

        {/* Card */}
        <div className="card-glass">
          <h2
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "var(--text)" }}
          >
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || localError) && (
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(231, 76, 60, 0.1)",
                  border: "1px solid rgba(231, 76, 60, 0.3)",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#e74c3c" }}
                >
                  {error || localError}
                </p>
              </div>
            )}

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@ecoloh.dz"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="text-center pt-4">
              <p
                className="text-sm"
                style={{ color: "var(--text)", opacity: 0.7 }}
              >
                Pas encore inscrit?{" "}
                <Link
                  to="/register"
                  className="font-bold hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Demo accounts */}
        <div
          className="mt-6 text-center text-sm"
          style={{ color: "var(--text)", opacity: 0.6 }}
        >
          <p className="font-semibold mb-1">Comptes de test:</p>
          <p>Admin: admin@ecoloh.dz / admin123</p>
          <p>User: user1@ecoloh.dz / user123</p>
        </div>
      </div>
    </div>
  );
}
