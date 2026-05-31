import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'stella';
  time: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // AI 加载状态
  const chatRef = useRef<HTMLDivElement>(null);

  // 每次都创建新的识别实例（修复第二次不能用）
  const getRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.lang = 'zh-CN';
    rec.continuous = true;
    rec.interimResults = true;
    return rec;
  };

  // 自动滚动
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 开始录音
  const startRecording = () => {
    const rec = getRecognition();
    if (!rec) return;

    setIsRecording(true);
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setInputText(text);
    };

    rec.onend = () => {
      if (isRecording) rec.start();
    };

    rec.start();
    (window as any).currentRec = rec;
  };

  // 停止录音
  const stopRecording = () => {
    setIsRecording(false);
    if ((window as any).currentRec) {
      try {
        (window as any).currentRec.stop();
      } catch {}
    }
  };

  // 切换录音
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      stopRecording();
      setTimeout(startRecording, 100);
    }
  };

  // ==============================================
  // ✅ 这里是【后端接口预留位】
  // 你只需要在这里替换成真实请求即可
  // ==============================================
  const getStellaReply = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // ========= 【对接后端接口】 =========
      // 把下面这一段替换成你的真实接口请求
      // ===================================
      const response = await fetch('https://你的后端地址/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,  // 发送给后端的内容
        }),
      });

      const data = await response.json();
      const reply = data.reply; // 后端返回的回答
      // ===================================

      setIsLoading(false);
      return reply || '我听不见你的声音了，再试一次吧';
    } catch (err) {
      setIsLoading(false);
      return '我好像迷路了 ✨';
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 加入用户消息
    setMessages([...messages, { id: Date.now(), content: inputText, sender: 'user', time }]);
    const userMsg = inputText;
    setInputText('');

    // ==============================
    // 调用 AI 接口获取真实回复
    // ==============================
    const reply = await getStellaReply(userMsg);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: reply,
        sender: 'stella',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 300);
  };

  const clearChat = () => setMessages([]);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #1e1e38)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Microsoft YaHei',
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* 顶部 */}
      <div style={{
        width: '100%',
        padding: '20px 24px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#c1d5ff' }}>Stella · 星之倾听者</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#aaa' }}>所有对话仅保存在本地</p>
      </div>

      {/* 聊天区域 */}
      <div ref={chatRef} style={{
        flex: 1,
        padding: '20px 24px',
        overflowY: 'auto',
        maxWidth: '700px',
        width: '100%',
        margin: '0 auto',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50%', color: '#888' }}>
            向 Stella 说说你的心事吧 ✨
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
              gap: '10px',
            }}>
              {msg.sender === 'stella' && (
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✨</div>
              )}

              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 18,
                  background: msg.sender === 'user' ? '#7c3aed' : '#2563eb',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 10, color: '#ffffff99', marginTop: 4 }}>
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>我</div>
              )}
            </div>
          ))
        )}

        {/* AI 正在思考 */}
        {isLoading && (
          <div style={{ textAlign: 'center', color: '#888', margin: '10px 0' }}>
            Stella 正在思考...
          </div>
        )}
      </div>

      {/* 底部 */}
      <div style={{
        width: '100%',
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <button onClick={clearChat} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: 'none', color: '#ccc',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>🗑️</button>

        <button onClick={toggleRecording} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)',
          border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{isRecording ? '⏹️' : '🎤'}</button>

        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={isRecording ? "正在录音…点击停止" : "输入消息或点击麦克风"}
          style={{
            flex: 1, padding: '10px 16px',
            borderRadius: 20, border: 'none', outline: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff'
          }}
        />

        <button onClick={sendMessage} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#4f46e5', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>➡️</button>
      </div>
    </div>
  );
}