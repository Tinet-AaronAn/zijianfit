# 自健身 App (ZiJianFit)

**版本**: MVP v1.0  
**最后更新**: 2026-03-09 14:15  
**项目进度**: 100% ✅

---

## 🎉 项目亮点

- ✅ **登录方式**: 用户名密码登录
- ✅ **跟练模式**: 视频 + 轮次计数
- ✅ **后端 API**: 4 个认证接口 + 4 个计划接口
- ✅ **前端页面**: 6 个页面（登录/注册/首页/详情/跟练/统计）
- ✅ **CI/CD**: GitHub Actions 自动化流水线
- ✅ **视频资源**: 2 个跟练视频（upper-body.mp4, lower-body.mp4）

---

## 📁 项目结构

```
zijianfit/
├── docs/                    # 📄 文档
│   ├── prd/                # 产品需求
│   │   ├── PRD.md          # 产品需求文档
│   │   └── CHANGE_LOG.md   # 需求变更记录
│   ├── design/             # UI 设计
│   │   ├── UI-DESIGN.md    # UI 设计规范
│   │   └── LOGIN_REDESIGN.md  # 登录重设计
│   ├── architecture/       # 架构设计
│   │   ├── ARCHITECTURE.md # 完整架构
│   │   └── TECH_STACK.md   # 技术栈
│   ├── testing/            # 测试文档
│   ├── ANDROID_DEVELOPMENT.md  # Android 开发指南
│   └── CI-CD-SETUP.md      # CI/CD 配置指南
├── backend/                 # 🔧 后端服务 (Node.js + Koa)
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模型
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── app.ts          # Koa 应用
│   ├── public/videos/      # 视频资源
│   └── package.json
├── mobile/                  # 📱 前端应用 (React Native)
│   └── src/
│       ├── screens/        # 页面
│       │   ├── LoginScreen.tsx
│       │   ├── RegisterScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── WorkoutDetailScreen.tsx
│       │   ├── FollowWorkoutScreen.tsx  # 跟练模式 ✨
│       │   └── StatsScreen.tsx
│       ├── services/       # API 服务
│       └── stores/         # 状态管理 (Zustand)
├── scripts/                # 脚本
└── tests/                  # 测试
```

---

## 🛠️ 技术栈

### 前端
- **框架**: React Native 0.73+
- **状态管理**: Zustand
- **导航**: React Navigation 6
- **网络**: Axios
- **视频**: react-native-video

### 后端
- **框架**: Koa 2
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT
- **密码加密**: bcrypt
- **安全**: Helmet + CORS + Rate Limit

---

## 📦 已实现的 API

### 认证模块
| 方法 | 端点 | 描述 | 状态 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | ✅ |
| POST | /api/auth/login | 用户登录 | ✅ |
| GET | /api/auth/me | 获取当前用户 | ✅ |
| POST | /api/auth/refresh | 刷新 Token | ✅ |

### 计划模块
| 方法 | 端点 | 描述 | 状态 |
|------|------|------|------|
| GET | /api/plans/current | 获取当前计划 | ✅ |
| GET | /api/plans/my | 获取我的计划 | ✅ |
| GET | /api/plans/:planId | 获取计划详情 | ✅ |
| GET | /api/plans/:planId/days/:dayOfWeek | 获取某日计划 | ✅ |

---

## 🚀 快速开始

### 后端

```bash
cd backend

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

### 前端

```bash
cd mobile

# 安装依赖
npm install

# iOS (需要 Mac)
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

---

## 🎯 核心功能（MVP）

### P0 - 必须完成 ✅
- [x] 用户名密码登录
- [x] 用户注册
- [x] 周计划展示
- [x] 训练详情页
- [x] **跟练模式** ✨
  - [x] 视频播放
  - [x] 轮次计数
  - [x] 完成庆祝

### P1 - 重要功能 ✅
- [x] 周统计页
- [x] 视频资源（2个跟练视频）

---

## 🎨 设计规范

### 配色
- **主色**: `#FF6B35` 活力橙
- **辅色**: `#1A1A2E` 深夜蓝
- **成功**: `#10B981` 翡翠绿

### 字体
- **标题**: 24-32px Bold
- **正文**: 14-16px Regular
- **说明**: 12px Light

---

## ⚠️ 重要说明

### 登录方式变更（2026-03-03）
- ❌ 移除微信登录
- ✅ 改用用户名密码登录
- **原因**: 简化开发，避免微信平台认证复杂度
- **文档**: [CHANGE_LOG.md](docs/prd/CHANGE_LOG.md)

### CI/CD 流水线（2026-03-09）
- ✅ 后端：测试 → Docker 构建 → SSH 部署
- ✅ 移动端：测试 → 构建 APK → GitHub Release
- **文档**: [CI-CD-SETUP.md](docs/CI-CD-SETUP.md)

---

## 📚 文档索引

### 产品文档
- [产品需求文档](docs/prd/PRD.md)
- [需求变更记录](docs/prd/CHANGE_LOG.md)

### 技术文档
- [系统架构](docs/architecture/ARCHITECTURE.md)
- [技术栈选型](docs/architecture/TECH_STACK.md)
- [CI/CD 配置指南](docs/CI-CD-SETUP.md)

### 设计文档
- [UI 设计规范](docs/design/UI-DESIGN.md)
- [登录重设计](docs/design/LOGIN_REDESIGN.md)

---

## 📞 联系方式

**项目负责人**: 安老师  
**AI 助手**: 随行 🦞  

---

**最后更新**: 2026-03-09 14:15  
**项目进度**: 100% ✅
