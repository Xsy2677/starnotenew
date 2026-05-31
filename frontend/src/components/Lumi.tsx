export default function Lumi() {
  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '90px',
        width: '64px',
        height: '64px',
        background: 'rgba(179, 217, 255, 0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 200,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ fontSize: '28px' }}>🐾</span>
    </div>
  );
}