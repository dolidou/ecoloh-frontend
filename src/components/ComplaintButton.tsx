import { useState } from 'react';

export default function ComplaintButton() {
  const [showModal, setShowModal] = useState(false);
  const [complaint, setComplaint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call pour envoyer la réclamation
    alert('Réclamation envoyée: ' + complaint);
    setComplaint('');
    setShowModal(false);
  };

  return (
    <>
      {/* Bouton fixe */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          fontWeight: 800,
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 10px 20px rgba(231,76,60,0.3)',
        }}
      >
        ⚠️ Réclamation
      </button>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: 'var(--radius)',
              width: '90%',
              maxWidth: '500px',
              color: '#333',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Déposer une réclamation</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Décrivez votre problème ici..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  marginBottom: '15px',
                }}
                required
              />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Envoyer
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-primary"
                style={{ width: '100%', background: '#7f8c8d', marginTop: '10px' }}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
