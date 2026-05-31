export default function About() {
  return (
    <div style={{
      maxWidth: '720px',
      margin: '40px auto 0',
      padding: '48px 36px',
      background: 'rgba(30, 41, 59, 0.55)',
      backdropFilter: 'blur(18px)',
      borderRadius: '24px',
      border: '1px solid rgba(125, 211, 252, 0.15)',
      color: '#e2e8f0',
      fontFamily: 'Microsoft YaHei',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      {/* 标题 */}
      <h1 style={{
        fontSize: '30px',
        color: '#bae6fd',
        marginBottom: '16px',
        fontWeight: 600,
        letterSpacing: '2px',
        textAlign: 'center'
      }}>
        关于 StarNook
      </h1>

      <p style={{
        fontSize: '15px',
        color: '#cbd5e1',
        lineHeight: '1.9',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        一个由大学生团队开发的匿名 AI 情绪陪伴实验项目。<br />
        我们相信：每一种情绪都值得被温柔接住。
      </p>

      <p style={{
        fontSize: '15px',
        color: '#cbd5e1',
        lineHeight: '1.9',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        Stella 是你的 AI 倾诉伙伴，Lumi 是陪你左右的温暖光点。
      </p>

      {/* 分割线 */}
      <div style={{
        borderBottom: '1px solid rgba(125, 211, 252, 0.12)',
        marginBottom: '32px'
      }} />

      {/* 隐私承诺 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '18px',
          color: '#a5b4fc',
          marginBottom: '12px'
        }}>
          🔒 隐私承诺
        </h2>
        <ul style={{
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#cbd5e1',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>对话记录仅存储在您的浏览器本地（IndexedDB），不传输至任何服务器</li>
          <li>匿名星云中的心事以纯文本形式脱敏存储，无法追溯到个人</li>
          <li>您可以随时一键清除本地所有数据</li>
        </ul>
      </div>

      {/* 校内心理资源（北京邮电大学） */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '18px',
          color: '#a5b4fc',
          marginBottom: '12px'
        }}>
          🏫 校内心理资源
        </h2>
        <ul style={{
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#cbd5e1',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>心理咨询中心：010-62282124（工作时间：周一至周五 9:00-12:00，14:00-17:00）</li>
          <li>24小时心理援助热线：400-161-9995</li>
          <li>地址：北京市海淀区西土城路10号 北京邮电大学学生活动中心4层</li>
        </ul>
      </div>

      {/* 全国热线 & 其他 */}
      <div style={{
        fontSize: '14px',
        lineHeight: '1.8',
        color: '#cbd5e1'
      }}>
        <p style={{ margin: '0 0 12px' }}>
          📞 全国心理援助热线：400-161-9995
        </p>
        <p style={{ margin: '0 0 12px' }}>
          项目开源地址：[GitHub 仓库链接]
        </p>
        <p style={{ margin: 0 }}>
          联系我们：[团队邮箱]
        </p>
      </div>
    </div>
  );
}