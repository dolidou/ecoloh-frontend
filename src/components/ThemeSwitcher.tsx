interface ThemeSwitcherProps {
  readonly currentTheme: string;
  readonly onThemeChange: (theme: string) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: Readonly<ThemeSwitcherProps>) {
  const themes = [
    { id: 'default', icon: '⚽', label: 'Sport' },
    { id: 'algerassic', icon: '🦖', label: 'Dino' },
    { id: 'space', icon: '🚀', label: 'Espace' },
    { id: 'drift', icon: '🏎️', label: 'Drift' },
    { id: 'other', icon: '🍃', label: 'Ateliers' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '8px',
        borderRadius: '50px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          style={{
            border: 'none',
            background: currentTheme === theme.id ? 'var(--primary)' : 'transparent',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '40px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
        >
          {theme.icon} {theme.label}
        </button>
      ))}
    </nav>
  );
}
