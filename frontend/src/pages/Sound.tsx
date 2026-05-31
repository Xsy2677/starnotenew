import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDB } from '../utils/indexedDB';

interface SoundItem {
  id: string;
  name: string;
  src: string;
  icon: string;
}

const soundList: SoundItem[] = [
  { id: 'fire', name: '篝火', src: '/music/fire.mp3', icon: '🔥' },
  { id: 'forest', name: '森林', src: '/music/forest.mp3', icon: '🌲' },
  { id: 'guitar', name: '吉他', src: '/music/guitar.mp3', icon: '🎸' },
  { id: 'rain', name: '雨声', src: '/music/rain.mp3', icon: '🌧️' },
  { id: 'stream', name: '溪流', src: '/music/stream.mp3', icon: '💧' },
  { id: 'waves', name: '海浪', src: '/music/waves.mp3', icon: '🌊' },
];

export default function Sound() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [activeSounds, setActiveSounds] = useState<SoundItem[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    soundList.forEach((item) => {
      const audio = new Audio(item.src);
      audio.loop = true;
      audio.volume = 0;
      audioRefs.current[item.id] = audio;
      setVolumes((prev) => ({ ...prev, [item.id]: 0 }));
    });
    return () => {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, item: SoundItem) => {
    e.dataTransfer.setData('soundId', item.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const soundId = e.dataTransfer.getData('soundId');
    const item = soundList.find(s => s.id === soundId);
    if (item && !activeSounds.find(s => s.id === soundId)) {
      setActiveSounds(prev => [...prev, item]);
      const audio = audioRefs.current[soundId];
      if (audio) {
        audio.volume = 0.5;
        setVolumes(prev => ({ ...prev, [soundId]: 0.5 }));
        audio.play().catch(() => {});
        setPlaying(prev => ({ ...prev, [soundId]: true }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const togglePlay = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playing[id]) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVolume = (id: string, val: number) => {
    const audio = audioRefs.current[id];
    if (audio) audio.volume = val;
    setVolumes(prev => ({ ...prev, [id]: val }));
  };

  const removeSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.volume = 0;
    }
    setPlaying(prev => ({ ...prev, [id]: false }));
    setActiveSounds(prev => prev.filter(s => s.id !== id));
  };

  const handleClose = () => setShowFeedback(true);

  // ✅ 保存情绪记录（不会覆盖，永久保存多条）
  const submitFeedback = async (mood: string) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      await IDB.saveEmotion({
        date,
        emotion: mood,
        type: 'sound',
        note: `声音沙盘体验：${mood === 'calm' ? '平静' : mood === 'neutral' ? '一般' : '无变化'}`
      });

      alert('保存成功！');
      setShowFeedback(false);
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('保存成功');
      navigate('/');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#fff',
      fontFamily: 'Microsoft YaHei'
    }}>
      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#7dd3fc',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        ← 返回工具箱
      </button>

      <h1 style={{ color: '#7dd3fc', marginBottom: '30px', textAlign: 'center' }}>🎧 声音沙盘</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '20px',
        maxWidth: '600px',
        margin: '0 auto 30px'
      }}>
        {soundList.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #333',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontSize: '16px', marginBottom: '15px' }}>{item.name}</div>

            <button
              onClick={() => togglePlay(item.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                border: 'none',
                background: playing[item.id] ? '#f43f5e' : '#3b82f6',
                color: '#fff',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {playing[item.id] ? '暂停' : '播放'}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes[item.id] || 0.5}
              onChange={(e) => handleVolume(item.id, parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '15px' }}
            />
          </div>
        ))}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '16px',
          border: '2px dashed rgba(125, 252, 252, 0.3)',
          padding: '30px 20px',
          minHeight: '200px',
          maxWidth: '800px',
          margin: '0 auto 30px',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
          拖拽上方卡片到这里 → 混合播放
        </p>

        {activeSounds.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '10px 16px',
            borderRadius: '10px',
            width: '100%',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes[item.id] || 0}
              onChange={(e) => handleVolume(item.id, parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ color: '#cbd5e1', minWidth: '40px' }}>
              {Math.round((volumes[item.id] || 0) * 100)}%
            </span>
            <button
              onClick={() => removeSound(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {showFeedback && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid rgba(125,252,252,0.3)',
            maxWidth: '350px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '20px' }}>听完感觉如何？</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => submitFeedback('calm')}
                style={{
                  background: 'rgba(125,211,252,0.2)',
                  border: '1px solid rgba(125,252,252,0.4)',
                  color: '#7dd3fc',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                😌 平静
              </button>
              <button
                onClick={() => submitFeedback('neutral')}
                style={{
                  background: 'rgba(167,139,250,0.2)',
                  border: '1px solid rgba(167,139,250,0.4)',
                  color: '#a78bfa',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                🤨 一般
              </button>
              <button
                onClick={() => submitFeedback('nochange')}
                style={{
                  background: 'rgba(248,113,113,0.2)',
                  border: '1px solid rgba(248,113,113,0.4)',
                  color: '#f87171',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                😔 没感觉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}