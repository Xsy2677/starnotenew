export default function Footer() {
  return (
    <footer
      className="glass-card"
      style={{
        borderRadius: 0,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '12px 24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#667080',
        marginTop: 'auto',
      }}
    >
      隐私承诺 · 匿名协议 · 心理援助热线：400-161-9995 · 关于我们
      <br />
      <span style={{ fontSize: '11px', opacity: 0.7 }}>
        你的数据你做主 · 所有对话和情绪记录仅保存在你的浏览器中
      </span>
    </footer>
  );
}