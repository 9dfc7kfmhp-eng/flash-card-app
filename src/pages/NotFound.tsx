import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <h2>Seite nicht gefunden</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Die angeforderte Seite existiert nicht.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          display: 'inline-block',
        }}
      >
        Zurück zum Dashboard
      </Link>
    </div>
  );
}
