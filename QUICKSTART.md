# 🚀 快速开始指南

**5 分钟快速运行 ZijianFit**

---

## 📋 前置要求

- Node.js 18+
- Android Studio（Android 开发）
- Docker（可选，用于部署）

---

## 🏃 快速运行

### 1️⃣ 启动后端（3 分钟）

```bash
cd backend

# 安装依赖
npm install

# 初始化数据库
npx prisma generate
npx prisma migrate dev

# 启动服务
npm run dev
```

**验证**：访问 http://localhost:3001/health

---

### 2️⃣ 启动前端（2 分钟）

```bash
cd mobile

# 安装依赖
npm install --legacy-peer-deps

# 启动 Metro
npm start

# 新终端 - 运行 App
npm run android
```

---

## 🧪 测试账号

- **用户名**: `testuser`
- **密码**: `Test123456`

---

## 🎯 核心功能

1. **登录/注册** - 用户名密码认证
2. **查看计划** - 本周训练安排
3. **跟练模式** - 视频引导训练
4. **训练统计** - 周度训练数据

---

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| [README.md](./README.md) | 项目概览 |
| [backend/README.md](./backend/README.md) | 后端文档 |
| [mobile/README.md](./mobile/README.md) | 前端文档 |
| [backend/DOCKER_DEPLOYMENT.md](./backend/DOCKER_DEPLOYMENT.md) | Docker 部署 |
| [docs/CI-CD-SETUP.md](./docs/CI-CD-SETUP.md) | CI/CD 配置 |

---

## 🐛 常见问题

### 后端启动失败？

```bash
# 检查端口
lsof -i :3001

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 前端启动失败？

```bash
# 清理缓存
npm start -- --reset-cache

# 清理 Android 构建
cd android && ./gradlew clean && cd ..
```

---

## 💡 开发建议

1. **先启动后端**，确认 API 可访问
2. **使用模拟器**（API 28+）
3. **查看日志**（后端日志 + Metro 日志）
4. **参考文档**（docs 目录）

---

**需要帮助？** 查看 [完整文档](./docs/) 或联系 🦞 随行
