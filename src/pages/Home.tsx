import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ECOLOH Billetterie
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bienvenue sur la plateforme de billetterie centralisée
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue {user?.name}!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Vous êtes connecté en tant que <strong>{user?.role}</strong>
        </p>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Découvrez nos événements disponibles</li>
            <li>Réservez vos tickets favoris</li>
            <li>Effectuez votre paiement via SATIM</li>
            <li>Recevez vos tickets par email avec code QR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
