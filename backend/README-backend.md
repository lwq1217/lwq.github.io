# 后端部署与配置说明（Railway）

此后端为 Node.js + Express 最小示例，使用 PostgreSQL 作为用户存储，JWT 做简易鉴权。

快速在 Railway 上部署：
1. 前往 https://railway.app 并登录（支持 GitHub 账户）。
2. 新建项目（New Project）→ 选择 "Deploy from GitHub repo"（将仓库连接到 Railway），或新建空项目并添加 Postgres 插件。
3. 如果使用 Deploy from Repo，请选择本仓库并将 `backend` 目录作为部署源（或将后端单独放到新仓库再连接）。
4. 在 Railway 项目设置中添加环境变量：
   - DATABASE_URL （Railway 会在添加 Postgres 插件后提供）
   - JWT_SECRET （填入随机长串）
   - ALLOWED_ORIGIN （例如 https://lwq1217.github.io 或 http://localhost:5500）
5. 设置启动命令： `npm install && npm start`（Railway 会自动运行 `npm start`）。
6. 部署完成后，会得到一个后端 URL（例如 https://xxx.up.railway.app）。
7. 打开 Railway 的数据库控制台，执行 `backend/sql/init.sql` 创建 users 表，或通过 psql 连接并执行该 SQL。
8. 在仓库根的 index.html 中将 `window.API_BASE_URL = 'REPLACE_WITH_BACKEND_URL'` 替换为你的后端 URL。

注意：示例将 token 存于 localStorage，仅作学习用途，生产环境请使用 HttpOnly cookie 并实现 refresh token、邮件验证、密码重置等功能。
