import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from './Footer';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路由
  const [path, setPath] = useState(location.pathname);

  // 判断是否为首页
  const isHome = location.pathname === '/';

  // 监听路由变化
  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      fontFamily: "'Microsoft YaHei', sans-serif",
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ========== 顶栏：当前页面永久高亮 ========== */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '16px 28px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 999,
        boxSizing: 'border-box',
      }}>

        {/* LOGO */}
        <div onClick={() => navigate('/')} style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#c7d6ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}>
          🌟 StarNook
        </div>

        {/* 导航菜单（永久高亮当前页） */}
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            { name: 'AI 倾诉', path: '/chat' },
            { name: '放松空间', path: '/relax/breathing' },
            { name: '心情档案', path: '/archive' },
            { name: '匿名星云', path: '/stars' },
          ].map((item) => {
            const isActive = path === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setPath(item.path);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? 'rgba(125, 211, 252, 0.18)' : 'transparent',
                  color: isActive ? '#7dd3fc' : '#cbd5e1',
                  fontWeight: isActive ? 500 : 'normal',
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* 关于我们（也高亮） */}
        <button
          onClick={() => {
            navigate('/about');
            setPath('/about');
          }}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(125,211,252,0.3)',
            fontSize: '14px',
            cursor: 'pointer',
            transition: '0.2s',
            background: path === '/about' ? 'rgba(125,211,252,0.18)' : 'rgba(125,211,252,0.08)',
            color: path === '/about' ? '#7dd3fc' : '#c7d6ff',
          }}
        >
          关于我们
        </button>

      </div>

      {/* 内容区域 */}
      <div style={{
        flex: 1,
        padding: '100px 20px 20px',
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <Outlet />
      </div>

      {/* 👇 只有首页才显示 Footer */}
      {isHome && <Footer />}

    </div>
  );
}