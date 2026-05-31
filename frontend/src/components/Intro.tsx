import { useState } from 'react';

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(onEnter, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #0a0f1e 0%, #111b30 40%, #1a1630 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
    >
      <h1 style={{ color: '#b3d9ff', fontSize: '32px', fontWeight: 600 }}>🌟 StarNook</h1>
      <p style={{ color: '#8890a4', fontSize: '16px' }}>与自己和解，让情绪有处可依</p>
      <button
        onClick={handleEnter}
        style={{
          marginTop: '20px',
          padding: '12px 36px',
          borderRadius: '24px',
          border: '1px solid rgba(179, 217, 255, 0.4)',
          background: 'rgba(179, 217, 255, 0.1)',
          color: '#b3d9ff',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        进入 StarNook
      </button>
    </div>
  );
}