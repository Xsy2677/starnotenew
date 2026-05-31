import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [nickname, setNickname] = useState(
    localStorage.getItem('starnook_nickname') || ''
  );
  const [showInput, setShowInput] = useState(false);

  const saveNickname = (name: string) => {
    setNickname(name);
    localStorage.setItem('starnook_nickname', name);
    setShowInput(false);
  };

  return (
    <nav
      className="fixed-top glass-card"
      style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: '#b3d9ff',
          fontWeight: 600,
          fontSize: '18px',
        }}
      >
        🌟 StarNook
      </Link>

      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { path: '/chat', label: 'AI倾诉' },
          { path: '/relax/breathing', label: '放松空间' },
          { path: '/archive', label: '心情档案' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              textDecoration: 'none',
              color: location.pathname === path ? '#b3d9ff' : '#8890a4',
              fontWeight: location.pathname === path ? 600 : 400,
              fontSize: '15px',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div>
        {showInput ? (
          <input
            autoFocus
            placeholder="输入昵称"
            onBlur={(e) => saveNickname(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveNickname(e.currentTarget.value);
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '4px 10px',
              color: '#d0d6e0',
              width: '120px',
            }}
          />
        ) : (
          <span
            onClick={() => setShowInput(true)}
            style={{ cursor: 'pointer', color: '#8890a4', fontSize: '14px' }}
          >
            ☁️ {nickname || '设置昵称'}
          </span>
        )}
      </div>
    </nav>
  );
}