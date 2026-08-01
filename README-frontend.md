# 前端说明（示例）

这是一个极简的 React 前端示例（使用 CDN + Babel 在浏览器运行，便于直接通过 GitHub Pages 托管）。

如何配置：
1. 部署后端到 Railway（或其他 PaaS），得到后端 URL，例如 https://your-backend.up.railway.app
2. 编辑仓库根目录下的 index.html，将 window.API_BASE_URL 的值替换为你的后端 URL：
   <script>window.API_BASE_URL = 'https://your-backend.up.railway.app';</script>
3. 提交并推送到 main，GitHub Pages 会自动发布（确保 Pages 已启用并指向 main 分支 root）。

本示例注意事项：
- token 暂存在 localStorage，仅用于演示。实际生产请使用 HttpOnly cookie。
- 若你想用 create-react-app / Vite 开发并构建生产包，可替换前端结构并把构建产物部署到 Pages 或 Vercel。
