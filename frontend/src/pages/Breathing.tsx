import { useState, useEffect, useRef } from 'react';

export default function Breathing() {
  const [isStart, setIsStart] = useState(false);
  const [tip, setTip] = useState('点击开始开启呼吸练习');
  const [sound, setSound] = useState<'none' | 'waves' | 'rain'>('none');
  const [preMood, setPreMood] = useState('');
  const [postMood, setPostMood] = useState('');
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化背景音
  useEffect(() => {
    const bgAudio = new Audio();
    bgAudio.loop = true;
    bgAudio.volume = 0.2;
    bgAudioRef.current = bgAudio;

    return () => {
      bgAudioRef.current?.pause();
    };
  }, []);

  // 切换背景音
  useEffect(() => {
    const bg = bgAudioRef.current;
    if (!bg) return;

    bg.pause();
    bg.currentTime = 0;
    if (sound === 'waves') {
      bg.src = '/music/waves.mp3';
      bg.play().catch(() => console.log('waves 加载失败'));
    } else if (sound === 'rain') {
      bg.src = '/music/rain.mp3';
      bg.play().catch(() => console.log('rain 加载失败'));
    }
  }, [sound]);

  const clearAllTimer = () => {
    let id = window.setTimeout(() => {}, 0);
    while (id--) window.clearTimeout(id);
  };

  const startBreath = () => {
    if (isStart) return;
    setIsStart(true);

    const runLoop = () => {
      setTip('缓慢吸气');
      setTimeout(() => {
        setTip('平稳屏息');
        setTimeout(() => {
          setTip('缓缓呼气');
          setTimeout(runLoop, 8000);
        }, 7000);
      }, 4000);
    };
    runLoop();
  };

  // 停止练习：结束动画 + 自动静音
  const stopBreath = () => {
    clearAllTimer();
    setIsStart(false);
    setTip('点击开始开启呼吸练习');
    setSound('none'); // 自动切到静音
  };

  // ==============================================
  // 只在这里加了保存到情绪穹顶的逻辑，别的完全没动
  // ==============================================
  const saveMood = () => {
    if (!preMood || !postMood) {
      alert('请选择练习前后的心情');
      return;
    }
    const record = {
      pre: preMood,
      post: postMood,
      time: new Date().toLocaleString(),
    };
    localStorage.setItem('breathing_mood', JSON.stringify(record));

    // ====================== 新增：同步保存到情绪穹顶 ======================
    const moodType = postMood.includes('平静') || postMood.includes('轻松') 
      ? 'calm' 
      : postMood.includes('无变化') 
      ? 'neutral' 
      : 'anxious';

    const records = JSON.parse(localStorage.getItem('moodRecords') || '[]');
    records.push({
      type: 'breathing',
      mood: moodType,
      timestamp: Date.now()
    });
    localStorage.setItem('moodRecords', JSON.stringify(records));
    // ====================================================================

    alert('保存成功！');
    setPreMood('');
    setPostMood('');
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 30px',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      fontFamily: "'Microsoft YaHei', sans-serif",
      color: 'white'
    }}>
      <h1 style={{ fontSize: '36px', color: '#7dd3fc', marginBottom: 20 }}>🌊 海浪呼吸练习</h1>
      <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: 40 }}>跟随海浪节奏，放松身心</p>

      {/* 背景音乐选择 */}
      <div style={{ marginBottom: 50, display: 'flex', gap: 20, justifyContent: 'center' }}>
        <button onClick={() => setSound('none')} style={{
          padding: '12px 24px', borderRadius: 20, border: '1px solid #475569',
          background: sound === 'none' ? '#38bdf8' : '#1e293b', color: '#fff',
          fontSize: 15
        }}>🔇 静音</button>
        <button onClick={() => setSound('waves')} style={{
          padding: '12px 24px', borderRadius: 20, border: '1px solid #475569',
          background: sound === 'waves' ? '#38bdf8' : '#1e293b', color: '#fff',
          fontSize: 15
        }}>🌊 海浪</button>
        <button onClick={() => setSound('rain')} style={{
          padding: '12px 24px', borderRadius: 20, border: '1px solid #475569',
          background: sound === 'rain' ? '#38bdf8' : '#1e293b', color: '#fff',
          fontSize: 15
        }}>🌧️ 雨声</button>
      </div>

      {/* 呼吸动画圆圈 */}
      <div
        style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 50px',
          borderRadius: '50%',
          background: '#38bdf8',
          opacity: 0.8,
          boxShadow: '0 0 40px rgba(56,189,248,0.5)',
        }}
        className={isStart ? 'breath-animate' : ''}
      ></div>

      <h2 style={{ fontSize: '28px', color: '#7dd3fc', marginBottom: 40 }}>{tip}</h2>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: 30, justifyContent: 'center', marginBottom: 40 }}>
        <button
          onClick={startBreath}
          disabled={isStart}
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            borderRadius: '30px',
            border: 'none',
            background: isStart ? '#64748b' : '#38bdf8',
            color: '#fff',
            cursor: isStart ? 'not-allowed' : 'pointer'
          }}
        >
          开始练习
        </button>
        <button
          onClick={stopBreath}
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            borderRadius: '30px',
            border: 'none',
            background: '#475569',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          停止练习
        </button>
      </div>

      {/* 心情选择 & 保存 */}
      <div style={{ fontSize: 14, color: '#cbd5e1' }}>
        <div style={{ marginBottom: 15 }}>
          <span>练习前：</span>
          {['紧张', '焦虑', '疲惫', '平静'].map(m => (
            <button key={m} onClick={() => setPreMood(m)} style={{
              margin: '0 8px', padding: '8px 16px', borderRadius: 12,
              border: 'none', background: preMood === m ? '#38bdf8' : '#2a3756',
              color: '#fff', fontSize: 13
            }}>{m}</button>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <span>练习后：</span>
          {['轻松', '平静', '好转', '无变化'].map(m => (
            <button key={m} onClick={() => setPostMood(m)} style={{
              margin: '0 8px', padding: '8px 16px', borderRadius: 12,
              border: 'none', background: postMood === m ? '#38bdf8' : '#2a3756',
              color: '#fff', fontSize: 13
            }}>{m}</button>
          ))}
        </div>

        <button onClick={saveMood} style={{
          padding: '10px 20px', borderRadius: 16,
          border: 'none', background: '#10b981', color: '#fff',
          fontSize: 14
        }}>💾 保存本次心情</button>
      </div>

      <style>{`
        .breath-animate {
          animation: breathCycle 19s ease-in-out infinite;
        }
        @keyframes breathCycle {
          0% { transform: scale(1); }
          21% { transform: scale(1.4); }
          58% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}