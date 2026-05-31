import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/ai';
import { IDB } from '../utils/indexedDB';

const TEST_USER_ID = "test-user-001";
const TEST_SESSION_ID = "test-session-001";

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
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const getRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = 'zh-CN';
    rec.continuous = true;
    rec.interimResults = true;
    return rec;
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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

  const stopRecording = () => {
    setIsRecording(false);
    if ((window as any).currentRec) {
      try {
        (window as any).currentRec.stop();
      } catch {}
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      stopRecording();
      setTimeout(startRecording, 100);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = inputText;
    setInputText('');

    setMessages(prev => [...prev, {
      id: Date.now(),
      content: userMsg,
      sender: 'user',
      time
    }]);

    setIsLoading(true);
    try {
      const res = await sendChatMessage(TEST_USER_ID, userMsg, TEST_SESSION_ID);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: res.response,
        sender: 'stella',
        time: aiTime
      }]);

      // 本地保存
      await IDB.saveChat({
        session_id: TEST_SESSION_ID,
        messages: [...messages,
          { id: Date.now(), content: userMsg, sender: 'user', time },
          { id: Date.now() + 1, content: res.response, sender: 'stella', time: aiTime }
        ]
      });
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: '暂时无法连接服务器，请稍后再试',
        sender: 'stella',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
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

        {isLoading && (
          <div style={{ textAlign: 'center', color: '#888', margin: '10px 0' }}>
            Stella 正在思考...
          </div>
        )}
      </div>

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

        <button onClick={sendMessage} disabled={isLoading} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isLoading ? '#6366f180' : '#4f46e5',
          border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>➡️</button>
      </div>
    </div>
  );
}