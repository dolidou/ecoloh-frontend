export default function NewsTicker() {
  const news = [
    { icon: '🔥', label: 'NOUVEAU:', text: 'Street Food Festival - Juin 2026' },
    { icon: '🌙', label: 'EVENT:', text: 'Summer Night Swim - Accès Piscine' },
    { icon: '🎮', label: 'TOURNOI:', text: 'E-Sport Open Alger - Inscriptions ouvertes' },
  ];

  return (
    <div
      style={{
        background: '#1a1a1a',
        color: 'white',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        fontSize: '0.9rem',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'scroll-left 30s linear infinite',
        }}
      >
        {[...news, ...news, ...news].map((item, idx) => (
          <div key={idx} style={{ padding: '0 40px', fontWeight: 600 }}>
            <span style={{ color: 'var(--primary)', marginRight: '10px' }}>
              {item.icon} {item.label}
            </span>
            {item.text}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
