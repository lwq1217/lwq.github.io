// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 注册
app.post('/api/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  if(!email || !password) return res.status(400).json({ error: '邮箱和密码为必填' });
  try{
    const hashed = await bcrypt.hash(password, 10);
    const r = await pool.query(
      'INSERT INTO users(email, password_hash, display_name) VALUES($1,$2,$3) RETURNING id,email,display_name,created_at',
      [email, hashed, displayName]
    );
    res.json({ ok: true, user: r.rows[0] });
  }catch(err){
    console.error(err);
    if(err.code === '23505') return res.status(400).json({ error: '邮箱已被注册' });
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: '邮箱和密码为必填' });
  try{
    const r = await pool.query('SELECT id,email,password_hash,display_name FROM users WHERE email=$1',[email]);
    if(r.rowCount===0) return res.status(400).json({ error: '用户不存在' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(400).json({ error: '密码错误' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  }catch(err){ console.error(err); res.status(500).json({ error: '服务器错误' }); }
});

// 获取当前用户
app.get('/api/me', async (req, res) => {
  const auth = req.headers['authorization'] || '';
  const m = auth.match(/Bearer (.+)/);
  if(!m) return res.json({});
  const token = m[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    const r = await pool.query('SELECT id,email,display_name,created_at FROM users WHERE id=$1',[payload.userId]);
    if(r.rowCount===0) return res.json({});
    res.json({ user: r.rows[0] });
  }catch(err){ console.error(err); res.json({}); }
});

app.listen(PORT, ()=>console.log('Server listening on', PORT));
