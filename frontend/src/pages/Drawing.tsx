import React, { useState, useRef, useEffect, useCallback } from 'react';

interface MoodRecord {
  id?: number;
  date: string;
  image: string;
  mood: string;
  message: string;
}

export default function MoodCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(5);
  const [result, setResult] = useState<{ mood: string; msg: string } | null>(null);
  const [history, setHistory] = useState<MoodRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const colors = [
    '#38bdf8', '#0ea5e9', '#1d4ed8', '#818cf8', '#a78bfa',
    '#f87171', '#fb923c', '#facc15', '#f472b6', '#ec4899',
    '#4ade80', '#16a34a', '#84cc16', '#ffffff', '#d1d5db', '#6b7280'
  ];

  // 初始化 IndexedDB
  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open('MoodCanvasDB', 1);
      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('records')) {
          db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = (e: Event) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('records', 'readonly');
        const store = tx.objectStore('records');
        store.getAll().onsuccess = (res: Event) => {
          const records = (res.target as IDBRequest).result as MoodRecord[];
          setHistory(records);
        };
      };
    };
    initDB();
  }, []);

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const start = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const analyze = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let nonBackgroundPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 30 && g < 40 && b < 60) continue;
      nonBackgroundPixels++;
    }

    if (nonBackgroundPixels < 40) {
      setResult({ mood: '内容不足', msg: '再多绘制一些线条，才能精准分析情绪' });
      return;
    }

    const lineDensity = nonBackgroundPixels / (canvas.width * canvas.height);
    const warmColors = ['#f87171', '#fb923c', '#facc15', '#f472b6', '#ec4899'];
    const darkColors = ['#1d4ed8', '#6b7280'];
    const isWarm = warmColors.includes(selectedColor);
    const isDark = darkColors.includes(selectedColor);
    const heavyLine = lineWidth >= 7;

    if (isWarm && (heavyLine || lineDensity > 0.04)) {
      setResult({ mood: '烦躁激动', msg: '线条杂乱厚重、色彩浓烈，当下情绪起伏偏大，内心略显焦躁' });
    } else if (lineDensity > 0.09) {
      setResult({ mood: '思绪纷乱', msg: '线条交错缠绕，思绪繁杂难以沉静' });
    } else if (isWarm) {
      setResult({ mood: '愉悦活力', msg: '暖调笔触轻快舒展，心情轻松富有朝气' });
    } else if (isDark && lineDensity < 0.06) {
      setResult({ mood: '沉静低落', msg: '色调暗沉笔触舒缓，心境安静略带低沉疲惫' });
    } else {
      setResult({ mood: '放松平和', msg: '笔触温和色调舒缓，处于安稳放松的状态' });
    }
  }, [selectedColor, lineWidth]);

  const saveRecord = () => {
    if (!result) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    const record: MoodRecord = {
      date: new Date().toLocaleString(),
      image: imageData,
      mood: result.mood,
      message: result.msg
    };

    const request = indexedDB.open('MoodCanvasDB', 1);
    request.onsuccess = (e: Event) => {
      const db = (e.target as IDBOpenDBRequest).result;
      const tx = db.transaction('records', 'readwrite');
      const store = tx.objectStore('records');
      store.add(record).onsuccess = () => {
        alert('记录保存成功');
        store.getAll().onsuccess = (res: Event) => {
          const records = (res.target as IDBRequest).result as MoodRecord[];
          setHistory(records);
        };
      };
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 400);
    setResult(null);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      padding: '40px 20px', fontFamily: 'Microsoft YaHei', color: '#fff', textAlign: 'center'
    }}>
      <h1 style={{ color: '#7dd3fc', fontSize: 30 }}>🎨 情绪涂鸦</h1>
      <p style={{ marginBottom: 20, fontSize: 15 }}>画出你的心情，AI 为你解读并保存记录</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 }}>
        {colors.map(c => (
          <button key={c} onClick={() => setSelectedColor(c)} style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            border: selectedColor === c ? '2px solid white' : 'none', cursor: 'pointer'
          }} />
        ))}
      </div>

      <div style={{ marginBottom: 15, fontSize: 14 }}>
        画笔粗细：
        <input type="range" min="1" max="20" value={lineWidth} onChange={e => setLineWidth(+e.target.value)} style={{ width: 150 }} />
      </div>

      <canvas
        ref={canvasRef} width={600} height={400}
        style={{ borderRadius: 12, background: '#0f172a', border: '1px solid #475569', maxWidth: '100%' }}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      />

      <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={analyze} style={{ padding: '10px 22px', borderRadius: 25, background: '#38bdf8', color: '#fff', border: 'none', fontSize: 15, cursor: 'pointer' }}>分析情绪</button>
        <button onClick={saveRecord} disabled={!result} style={{ padding: '10px 22px', borderRadius: 25, background: result ? '#4ade80' : '#475569', color: '#fff', border: 'none', fontSize: 15, cursor: result ? 'pointer' : 'not-allowed' }}>保存记录</button>
        <button onClick={clear} style={{ padding: '10px 22px', borderRadius: 25, background: '#475569', color: '#fff', border: 'none', fontSize: 15, cursor: 'pointer' }}>清空画布</button>
        <button onClick={() => setShowHistory(!showHistory)} style={{ padding: '10px 22px', borderRadius: 25, background: '#a78bfa', color: '#fff', border: 'none', fontSize: 15, cursor: 'pointer' }}>
          {showHistory ? '隐藏历史' : '查看历史'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 25, padding: '20px 30px', background: '#1e293b', borderRadius: 15, maxWidth: 500, margin: '25px auto' }}>
          <h3 style={{ color: '#7dd3fc', margin: '0 0 8px 0' }}>{result.mood}</h3>
          <p style={{ margin: 0, fontSize: 15 }}>{result.msg}</p>
        </div>
      )}

      {showHistory && (
        <div style={{ marginTop: 40, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
          <h3 style={{ color: '#7dd3fc', textAlign: 'center' }}>📜 历史记录</h3>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#cbd5e1' }}>暂无记录</p>
          ) : (
            history.map((record) => (
              <div key={record.id} style={{ background: '#1e293b', borderRadius: 12, padding: 15, marginBottom: 15 }}>
                <img src={record.image} alt="涂鸦" style={{ maxWidth: '100%', height: 120, objectFit: 'contain', borderRadius: 8 }} />
                <p style={{ color: '#7dd3fc', margin: '10px 0 5px 0' }}>{record.date} | {record.mood}</p>
                <p style={{ color: '#cbd5e1', margin: 0 }}>{record.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}