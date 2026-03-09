# 技术栈选型总结

**版本**: v1.1  
**日期**: 2026-03-09

---

## 快速参考

### 前端技术栈

```yaml
框架: React Native 0.73+
导航: React Navigation 6.x
状态管理: Zustand 4.x
网络请求: Axios 1.x
视频播放: react-native-video 6.x
推送通知: @notifee/react-native 7.x
本地存储: AsyncStorage
UI组件库: React Native Paper 5.x
```

### 后端技术栈

```yaml
运行时: Node.js 18+
框架: Koa 2.x
数据库: SQLite 3.x
ORM: Prisma 5.x
认证: JWT（用户名密码）
密码加密: bcrypt
参数校验: Joi 17.x
日志: Winston 3.x
```

---

## 核心依赖安装

### 后端

```bash
# 核心框架
npm install koa @koa/router koa-bodyparser

# 数据库
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite

# 认证
npm install jsonwebtoken bcryptjs

# 参数校验
npm install joi

# 工具
npm install dotenv winston
```

### 前端

```bash
# 导航
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# 状态管理
npm install zustand

# 网络
npm install axios

# 视频
npm install react-native-video

# 存储
npm install @react-native-async-storage/async-storage

# UI
npm install react-native-paper
npm install react-native-vector-icons
```

---

## 数据库快速设置

### Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

// 完整 schema 见 ARCHITECTURE.md
```

### 迁移命令

```bash
# 创建数据库
npx prisma migrate dev --name init

# 生成客户端
npx prisma generate

# 打开数据库 GUI
npx prisma studio
```

---

## API 快速参考

### 认证

```bash
# 用户注册
POST /auth/register
Body: { "username": "...", "password": "...", "confirmPassword": "..." }

# 用户登录
POST /auth/login
Body: { "username": "...", "password": "..." }

# 获取用户信息
GET /auth/me
Headers: { "Authorization": "Bearer <token>" }

# 刷新 Token
POST /auth/refresh
Headers: { "Authorization": "Bearer <token>" }
```

### 计划

```bash
# 获取本周计划
GET /plans/current

# 获取某日详情
GET /plans/:id/days/:day
```

### 进度

```bash
# 完成打卡
POST /progress/checkin
Body: { "planId": "...", "date": "2026-02-28" }

# 完成一组
POST /progress/set-complete
Body: { "planId": "...", "date": "2026-02-28", "exerciseId": "...", "setNumber": 1 }
```

### 统计

```bash
# 周统计
GET /stats/weekly?weekNumber=9&year=2026
```

---

## 目录结构快速创建

### 后端

```bash
mkdir -p backend/src/{config,prisma,middlewares,routes,services,utils}
touch backend/src/{app.ts,config/index.ts}
touch backend/.env .env.example package.json README.md
```

### 前端

```bash
mkdir -p mobile/src/{screens,components/{common},navigation,store,services,utils,constants}
touch mobile/src/{App.tsx}
touch mobile/package.json README.md
```

---

## 开发时间估算

| 模块 | 后端 | 前端 | 并行总计 |
|------|------|------|----------|
| 认证 | 0.5 天 | 0.5 天 | 0.5 天 |
| 计划 | 0.5 天 | 1 天 | 1 天 |
| 进度 | 0.5 天 | 1 天 | 1 天 |
| 统计 | 0.25 天 | 0.5 天 | 0.5 天 |
| 其他 | 0.75 天 | 0.5 天 | 0.75 天 |
| **总计** | **2.5 天** | **3.5 天** | **3 天** ✅ |

---

## 技术风险检查清单

### Day 0（开始前）

- [x] Node.js 18+ 已安装
- [x] React Native CLI 已安装
- [x] Android 模拟器已配置
- [x] 测试手机已准备（Android）

### Day 1

- [x] 后端 API 开发完成
- [x] 用户认证测试通过
- [x] 前端项目初始化

### Day 2

- [x] 视频播放正常
- [x] 数据库迁移成功
- [x] 核心流程跑通

### Day 3

- [x] CI/CD 配置
- [x] Docker 部署
- [x] UI 细节调整

---

## 常见问题

### Q1: 视频加载慢？

**原因**: 视频文件太大

**解决**:
- 压缩视频（推荐 HandBrake）
- 使用本地视频文件
- 预加载第一个视频

### Q2: SQLite 数据丢失？

**原因**: 数据库文件未备份

**解决**:
- 定期备份 `dev.db` 文件
- 使用 Git LFS 管理数据库文件
- 或使用云数据库（PostgreSQL）

### Q3: 推送通知不工作？

**原因**: 权限未授权

**解决**:
```javascript
// 请求权限
import notifee from '@notifee/react-native';

await notifee.requestPermission();
```

---

## 下一步行动

1. **创建项目**（30 分钟）
   - 初始化 React Native 项目
   - 初始化 Node.js 项目

2. **搭建后端**（2 小时）
   - 初始化 Prisma
   - 创建数据模型
   - 实现认证 API

3. **前端开发**（1 天）
   - 实现页面
   - 对接 API
   - 集成视频

---

**维护者**: 梁构  
**更新**: 2026-03-09
