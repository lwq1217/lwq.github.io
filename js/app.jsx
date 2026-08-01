// 简易 React 前端，使用 CDN + Babel 在浏览器中运行（仅示例/开发用）
const { useState, useEffect } = React;

function App(){
  const [view, setView] = useState('login'); // 'login' | 'register' | 'me'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const API = window.API_BASE_URL || '';

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      fetch(`${API}/api/me`,{headers:{'Authorization': 'Bearer '+token}})
        .then(r=>r.json())
        .then(data=>{
          if(data.user) setUser(data.user);
        }).catch(()=>{});
    }
  },[]);

  async function handleRegister(e){
    e.preventDefault();
    setMessage('');
    try{
      const res = await fetch(`${API}/api/register`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password, displayName })
      });
      const data = await res.json();
      if(data.ok){
        setMessage('注册成功，请登录');
        setView('login');
      } else {
        setMessage(data.error || '注册失败');
      }
    }catch(err){ setMessage('网络错误') }
  }

  async function handleLogin(e){
    e.preventDefault();
    setMessage('');
    try{
      const res = await fetch(`${API}/api/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(data.token){
        localStorage.setItem('token', data.token);
        setMessage('登录成功');
        const meRes = await fetch(`${API}/api/me`,{headers:{'Authorization':'Bearer '+data.token}});
        const meData = await meRes.json();
        if(meData.user) setUser(meData.user);
        setView('me');
      } else {
        setMessage(data.error || '登录失败');
      }
    }catch(err){ setMessage('网络错误') }
  }

  function handleLogout(){
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  }

  return (
    <div className="container">
      <h1>个人系统（示例）</h1>
      <div className="nav">
        <button onClick={()=>setView('login')}>登录</button>
        <button onClick={()=>setView('register')}>注册</button>
        <button onClick={()=>setView('me')}>我的</button>
      </div>
      {message && <div className="message">{message}</div>}

      {view==='register' && (
        <form onSubmit={handleRegister} className="form">
          <input placeholder="显示名" value={displayName} onChange={e=>setDisplayName(e.target.value)} required />
          <input placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button type="submit">注册</button>
        </form>
      )}

      {view==='login' && (
        <form onSubmit={handleLogin} className="form">
          <input placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button type="submit">登录</button>
        </form>
      )}

      {view==='me' && (
        <div className="me">
          {user ? (
            <>
              <p>欢迎，{user.display_name || user.email}</p>
              <p>注册时间：{user.created_at}</p>
              <button onClick={handleLogout}>登出</button>
            </>
          ) : (
            <p>未登录</p>
          )}
        </div>
      )}

      <footer>
        <p>演示用途：token 存在 localStorage，生产环境请改为 HttpOnly cookie。</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
