import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    if (formData.password !== formData.password_confirmation) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message || "Erreur lors de l'inscription");
      } else {
        setLocalError("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-lg" style={{ color: "var(--text)", opacity: 0.8 }}>
            Créez votre compte
          </p>
        </div>

        {/* Card */}
        <div className="card-glass">
          <h2
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "var(--text)" }}
          >
            S'inscrire
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
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
                placeholder="votre@email.com"
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

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="••••••••"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Inscription..." : "Créer mon compte"}
            </button>

            <div className="text-center pt-4">
              <p
                className="text-sm"
                style={{ color: "var(--text)", opacity: 0.7 }}
              >
                Déjà inscrit?{" "}
                <Link
                  to="/login"
                  className="font-bold hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
