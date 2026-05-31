import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    calm: 0,
    anxious: 0,
    hope: 0
  });

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('moodRecords') || '[]');
    const weekAgo = Date.now() - 7 * 24 * 60 * 1000;
    const weekRecords = records.filter((r: any) => r.timestamp >= weekAgo);

    let calm = 0, anxious = 0, neutral = 0;
    weekRecords.forEach((r: any) => {
      if (r.mood === 'calm') calm++;
      else if (r.mood === 'anxious') anxious++;
      else neutral++;
    });

    const total = weekRecords.length || 1;
    let calmPct = Math.round((calm / total) * 100);
    let anxiousPct = Math.round((anxious / total) * 100);
    let neutralPct = Math.round((neutral / total) * 100);

    const diff = 100 - (calmPct + anxiousPct + neutralPct);
    if (diff !== 0) {
      if (calmPct > 0) calmPct += diff;
      else if (neutralPct > 0) neutralPct += diff;
      else anxiousPct += diff;
    }

    setStats({
      calm: calmPct,
      anxious: anxiousPct,
      hope: neutralPct
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* 梦幻星空 · 情绪入口（月亮图标+20颗星星） */}
      <Card style={{
        textAlign: 'center',
        marginBottom: '20px',
        background: 'linear-gradient(145deg, rgba(18,25,45,0.8), rgba(10,15,35,0.9))',
        border: '1px solid rgba(180,220,255,0.15)',
        borderRadius: '24px',
        padding: '36px 24px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* 光晕 */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 35%, rgba(190,225,255,0.12) 0%, transparent 65%)',
          pointerEvents: 'none'
        }}></div>

        {/* 20颗星星 */}
        {[
          { t:'5%', l:'10%', s:3, o:0.7 },
          { t:'8%', l:'25%', s:2, o:0.6 },
          { t:'12%', l:'80%', s:4, o:0.7 },
          { t:'20%', l:'5%', s:2, o:0.5 },
          { t:'22%', l:'70%', s:3, o:0.6 },
          { t:'35%', l:'20%', s:2, o:0.6 },
          { t:'38%', l:'85%', s:3, o:0.7 },
          { t:'45%', l:'50%', s:2, o:0.5 },
          { t:'55%', l:'15%', s:4, o:0.7 },
          { t:'58%', l:'80%', s:2, o:0.6 },
          { t:'65%', l:'5%', s:3, o:0.7 },
          { t:'68%', l:'40%', s:2, o:0.5 },
          { t:'72%', l:'75%', s:3, o:0.6 },
          { t:'78%', l:'25%', s:2, o:0.5 },
          { t:'80%', l:'60%', s:4, o:0.7 },
          { t:'85%', l:'10%', s:2, o:0.6 },
          { t:'86%', l:'90%', s:3, o:0.7 },
          { t:'90%', l:'35%', s:2, o:0.5 },
          { t:'92%', l:'50%', s:3, o:0.6 },
          { t:'95%', l:'70%', s:2, o:0.5 }
        ].map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: star.t,
              left: star.l,
              width: star.s + 'px',
              height: star.s + 'px',
              background: 'rgba(210,235,255,' + star.o + ')',
              borderRadius: '50%',
              boxShadow: '0 0 ' + (star.s * 2) + 'px rgba(210,235,255,' + star.o + ')'
            }}
          />
        ))}

        {/* 新图标：温柔月亮🌙 */}
        <div style={{
          fontSize: '60px',
          marginBottom: '16px',
          filter: 'drop-shadow(0 0 12px rgba(180,220,255,0.4))'
        }}>🌙</div>

        <h2 style={{
          color: '#e0eaff',
          margin: '0 0 10px 0',
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '1px'
        }}>与你此刻的情绪相遇</h2>

        <p style={{
          color: '#b8cce4',
          margin: '0 0 28px 0',
          fontSize: '15px'
        }}>所有情绪，都值得被温柔接住</p>

        <button
          onClick={() => navigate('/chat')}
          style={{
            padding: '14px 40px',
            borderRadius: '32px',
            border: 'none',
            background: 'linear-gradient(135deg, #a5c8ff, #74aaff)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.35s ease',
            boxShadow: '0 4px 16px rgba(140,185,255,0.3)',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(140,185,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(140,185,255,0.3)';
          }}
        >
          ✨ 开始温柔对话
        </button>

        <p style={{
          color: '#889ab8',
          fontSize: '12px',
          marginTop: '18px',
          marginBottom: 0
        }}>仅本地保存 · 不打扰的温柔陪伴</p>
      </Card>

      {/* 情绪穹顶 */}
      <Card style={{
        background: 'linear-gradient(135deg, rgba(20,30,50,0.7), rgba(10,15,30,0.8))',
        border: '1px solid rgba(125,211,252,0.15)',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#e0eaff', margin: 0, fontSize: '18px' }}>📊 情绪穹顶 · 近7天</h3>
          <span
            onClick={() => navigate('/archive')}
            style={{ color: '#b3d9ff', fontSize: '14px', cursor: 'pointer' }}
          >
            完整档案
          </span>
        </div>

        <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>最近一周，你的心里住着「晴，偶有薄云」</p>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#7dd3fc' }}>平静</span>
            <span style={{ color: '#7dd3fc' }}>{stats.calm}%</span>
          </div>
          <div style={{ height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${stats.calm}%`, height: '100%', background: '#7dd3fc', borderRadius: '6px' }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#fdba74' }}>焦躁</span>
            <span style={{ color: '#fdba74' }}>{stats.anxious}%</span>
          </div>
          <div style={{ height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${stats.anxious}%`, height: '100%', background: '#fdba74', borderRadius: '6px' }}></div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#fcd34d' }}>期待</span>
            <span style={{ color: '#fcd34d' }}>{stats.hope}%</span>
          </div>
          <div style={{ height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${stats.hope}%`, height: '100%', background: '#fcd34d', borderRadius: '6px' }}></div>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(167,139,250,0.08)',
          border: '1px solid rgba(167,139,250,0.15)'
        }}>
          <p style={{ margin: 0, color: '#e0d0ff', fontSize: '14px' }}>
            ✨ Stella：我会一直陪着你，慢慢看见自己。
          </p>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
          ✨ 数据来源：呼吸练习 · 情绪速写 · 声音沙盘
        </p>
      </Card>

      {/* 轻疗愈工具箱 */}
      <Card style={{
        background: 'linear-gradient(135deg, rgba(20,30,50,0.7), rgba(10,15,30,0.8))',
        border: '1px solid rgba(125,211,252,0.15)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#e0eaff', marginBottom: '20px' }}>✨ 轻疗愈工具箱</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div
            onClick={() => navigate('/relax/breathing')}
            style={{
              background: 'rgba(125,211,252,0.08)',
              border: '1px solid rgba(125,211,252,0.25)',
              borderRadius: '18px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(125,211,252,0.25)';
              e.currentTarget.style.border = '1px solid rgba(125,211,252,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              e.currentTarget.style.border = '1px solid rgba(125,211,252,0.25)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌊</div>
            <div style={{ color: '#cfeaff' }}>呼吸之海</div>
          </div>

          <div
            onClick={() => navigate('/relax/draw')}
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.25)',
              borderRadius: '18px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(167,139,250,0.25)';
              e.currentTarget.style.border = '1px solid rgba(167,139,250,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              e.currentTarget.style.border = '1px solid rgba(167,139,250,0.25)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
            <div style={{ color: '#e0d0ff' }}>情绪速写</div>
          </div>

          <div
            onClick={() => navigate('/relax/sound')}
            style={{
              background: 'rgba(217,180,255,0.08)',
              border: '1px solid rgba(217,180,255,0.25)',
              borderRadius: '18px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(217,180,255,0.25)';
              e.currentTarget.style.border = '1px solid rgba(217,180,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              e.currentTarget.style.border = '1px solid rgba(217,180,255,0.25)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎵</div>
            <div style={{ color: '#f3e0ff' }}>声音沙盘</div>
          </div>
        </div>
      </Card>

      {/* 匿名星云 */}
      <Card style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#e0eaff' }}>🪐 匿名星云</h3>
        <p style={{ color: '#8890a4', marginTop: '8px' }}>那些被温柔接住的情绪...</p>
        <button
          onClick={() => navigate('/stars')}
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(179,217,255,0.3)',
            background: 'rgba(179,217,255,0.08)',
            color: '#b3d9ff',
            cursor: 'pointer'
          }}
        >
          进入星云社区 →
        </button>
      </Card>
    </div>
  );
}