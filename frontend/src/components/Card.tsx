export default function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '20px', ...style }}>
      {children}
    </div>
  );
}