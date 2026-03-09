# 自健身 App - 架构设计文档

**版本**: v1.1  
**架构师**: 梁构  
**日期**: 2026-03-09  
**开发周期**: 3 天 MVP

> **⚠️ 重要更新 (2026-03-03)**: 登录方式已从微信登录改为用户名密码登录，详见 [CHANGE_LOG.md](../prd/CHANGE_LOG.md)

---

## 1. 技术栈选型

### 1.1 前端技术栈（React Native）

| 类别 | 技术选型 | 版本 | 理由 |
|------|---------|------|------|
| **框架** | React Native | 0.73+ | 跨平台，成熟稳定 |
| **导航** | React Navigation | 6.x | 官方推荐，社区活跃 |
| **状态管理** | Zustand | 4.x | 简单轻量，避免 Redux 复杂性 |
| **网络请求** | Axios | 1.x | 成熟稳定，拦截器支持 |
| **视频播放** | react-native-video | 6.x | 标准选择，功能完善 |
| **推送通知** | @notifee/react-native | 7.x | 比 push-notification 更现代 |
| **本地存储** | AsyncStorage | 1.x | React Native 标准方案 |
| **UI 组件** | React Native Paper | 5.x | Material Design，快速开发 |

**技术风险**：
- ⚠️ react-native-wechat-lib 需要原生配置，首次集成可能耗时
- ⚠️ 视频播放性能依赖设备，低端机型可能卡顿

---

### 1.2 后端技术栈（Node.js）

| 类别 | 技术选型 | 版本 | 理由 |
|------|---------|------|------|
| **框架** | **Koa** | 2.x | async/await 友好，中间件优雅 |
| **数据库** | **SQLite** | 3.x | 零配置，单文件，MVP 足够 |
| **ORM** | **Prisma** | 5.x | 类型安全，快速开发 |
| **认证** | JWT | - | 无状态，适合移动端 |
| **密码加密** | bcrypt | - | 安全的密码哈希 |
| **参数校验** | Joi | 17.x | 成熟验证库 |
| **日志** | Winston | 3.x | 企业级日志 |
| **环境变量** | dotenv | 16.x | 配置管理 |

**为什么选 Koa 不选 Express/NestJS？**

| 对比项 | Express | Koa | NestJS |
|--------|---------|-----|--------|
| **学习曲线** | 低 | 低 | 高（需要 TypeScript + 装饰器） |
| **代码量** | 中等 | 最少 | 最多（约束多） |
| **开发速度** | 快 | 最快 | 慢（需要搭建结构） |
| **3天适配** | ✅ | ✅✅ | ❌ |

**选择 Koa**：轻量级，代码简洁，3 天 MVP 足够。

**为什么选 SQLite 不选 MySQL/PostgreSQL？**

| 对比项 | SQLite | MySQL/PostgreSQL |
|--------|--------|------------------|
| **部署** | 零配置 | 需要安装配置 |
| **维护** | 无需维护 | 需要运维 |
| **性能** | 小规模足够 | 高并发优势 |
| **迁移成本** | Prisma 可无缝迁移 | - |

**选择 SQLite**：MVP 阶段数据量小，SQLite 足够，后续可迁移到 PostgreSQL。

**技术风险**：
- ⚠️ SQLite 不支持高并发，单用户场景没问题
- ✅ 已移除微信登录依赖，降低集成复杂度

---

## 2. 系统架构图

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Native App (Android)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │  登录/注册   │  │  训练计划    │  │  视频播放  │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │  跟练模式     │  │  训练详情    │  │  周统计    │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        服务端层                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Koa + Prisma + SQLite                    │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │  认证服务     │  │  计划服务    │                 │  │
│  │  │  /auth/*     │  │  /plans/*    │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼              
        ┌──────────┐    
        │  SQLite  │    
        │  数据库   │    
        └──────────┘    
```

### 2.2 数据流图

#### 用户登录流程

```
用户 → 输入用户名密码 → 
  ↓
POST /api/auth/login → 验证用户 → 生成 JWT → 返回 token
  ↓
客户端存储 token → 后续请求携带 token
```

#### 训练流程

```
用户 → 查看"本周计划" → GET /api/plans/current → 显示 7 天计划
  ↓
点击某一天 → GET /api/plans/:planId/days/:dayOfWeek → 显示动作列表
  ↓
点击"跟练模式" → 进入训练页面
  ↓
播放视频 + 轮次计数
  ↓
全部完成 → 显示庆祝页面
```

---

## 3. 数据库设计

### 3.1 ER 图（文字描述）

```
┌──────────────┐
│     User     │───────┐
│──────────────│       │
│ id (PK)      │       │
│ openid       │       │ 1
│ phone        │       │
│ nickname     │       │
│ avatar       │       │
│ createdAt    │       │
└──────────────┘       │
                       │
                       │
                       │ N
              ┌────────┴────────┐
              │      Plan       │
              │─────────────────│
              │ id (PK)         │
              │ userId (FK)     │
              │ weekNumber      │
              │ year            │
              │ createdAt       │
              └────────┬────────┘
                       │
                       │ 1
                       │
                       │ N
              ┌────────┴────────┐
              │    DayPlan      │
              │─────────────────│
              │ id (PK)         │
              │ planId (FK)     │
              │ dayOfWeek (0-6) │
              │ isRestDay       │
              └────────┬────────┘
                       │
                       │ 1
                       │
                       │ N
              ┌────────┴────────┐
              │    Exercise     │
              │─────────────────│
              │ id (PK)         │
              │ dayPlanId (FK)  │
              │ name            │
              │ sets            │
              │ reps            │
              │ restSeconds     │
              │ videoUrl        │
              │ order           │
              └─────────────────┘


┌──────────────┐
│   Progress   │
│──────────────│
│ id (PK)      │
│ userId (FK)  │
│ planId (FK)  │
│ date         │
│ completedExercises (JSON) │
│ completedSets (JSON)      │
│ isCompleted  │
│ createdAt    │
└──────────────┘
```

### 3.2 数据表设计

#### User 表（用户）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | String | 用户 ID（UUID） | PRIMARY KEY |
| phone | String | 手机号 | UNIQUE |
| nickname | String | 昵称 | - |
| avatar | String | 头像 URL | - |
| createdAt | DateTime | 创建时间 | NOT NULL |

#### Plan 表（训练计划）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | String | 计划 ID（UUID） | PRIMARY KEY |
| userId | String | 用户 ID | FOREIGN KEY → User |
| weekNumber | Int | 周数（1-52） | NOT NULL |
| year | Int | 年份 | NOT NULL |
| createdAt | DateTime | 创建时间 | NOT NULL |

**索引**: `(userId, year, weekNumber)` 唯一索引

#### DayPlan 表（每日计划）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | String | 日计划 ID | PRIMARY KEY |
| planId | String | 周计划 ID | FOREIGN KEY → Plan |
| dayOfWeek | Int | 星期几（0-6） | NOT NULL |
| isRestDay | Boolean | 是否休息日 | NOT NULL |

**索引**: `(planId, dayOfWeek)` 唯一索引

#### Exercise 表（动作）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | String | 动作 ID | PRIMARY KEY |
| dayPlanId | String | 日计划 ID | FOREIGN KEY → DayPlan |
| name | String | 动作名称 | NOT NULL |
| sets | Int | 组数 | NOT NULL |
| reps | Int | 每组次数 | NOT NULL |
| restSeconds | Int | 休息时间（秒） | NOT NULL |
| videoUrl | String | 视频链接 | NOT NULL |
| order | Int | 顺序 | NOT NULL |

**索引**: `(dayPlanId, order)`

#### Progress 表（训练进度）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | String | 进度 ID | PRIMARY KEY |
| userId | String | 用户 ID | FOREIGN KEY → User |
| planId | String | 计划 ID | FOREIGN KEY → Plan |
| date | DateTime | 训练日期 | NOT NULL |
| completedExercises | String | 已完成动作（JSON 数组） | - |
| completedSets | String | 已完成组数（JSON 对象） | - |
| isCompleted | Boolean | 是否完成当日训练 | NOT NULL |
| createdAt | DateTime | 创建时间 | NOT NULL |

**索引**: `(userId, date)` 唯一索引

---

### 3.3 Prisma Schema

```prisma
// schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String     @id @default(uuid())
  openid    String     @unique
  phone     String?    @unique
  nickname  String?
  avatar    String?
  createdAt DateTime   @default(now())
  
  plans     Plan[]
  progress  Progress[]
  
  @@map("users")
}

model Plan {
  id         String     @id @default(uuid())
  userId     String
  weekNumber Int
  year       Int
  createdAt  DateTime   @default(now())
  
  user       User       @relation(fields: [userId], references: [id])
  dayPlans   DayPlan[]
  progress   Progress[]
  
  @@unique([userId, year, weekNumber])
  @@map("plans")
}

model DayPlan {
  id        String     @id @default(uuid())
  planId    String
  dayOfWeek Int        // 0-6
  isRestDay Boolean    @default(false)
  
  plan      Plan       @relation(fields: [planId], references: [id], onDelete: Cascade)
  exercises Exercise[]
  
  @@unique([planId, dayOfWeek])
  @@map("day_plans")
}

model Exercise {
  id          String   @id @default(uuid())
  dayPlanId   String
  name        String
  sets        Int
  reps        Int
  restSeconds Int
  videoUrl    String
  order       Int
  
  dayPlan     DayPlan  @relation(fields: [dayPlanId], references: [id], onDelete: Cascade)
  
  @@index([dayPlanId, order])
  @@map("exercises")
}

model Progress {
  id                  String   @id @default(uuid())
  userId              String
  planId              String
  date                DateTime
  completedExercises  String?  // JSON: ["exercise-id-1", "exercise-id-2"]
  completedSets       String?  // JSON: {"exercise-id-1": 3, "exercise-id-2": 2}
  isCompleted         Boolean  @default(false)
  createdAt           DateTime @default(now())
  
  user                User     @relation(fields: [userId], references: [id])
  plan                Plan     @relation(fields: [planId], references: [id])
  
  @@unique([userId, date])
  @@map("progress")
}
```

---

## 4. API 设计（RESTful）

### 4.1 API 概览

| 模块 | 端点 | 方法 | 说明 | 状态 |
|------|------|------|------|------|
| **认证** | /api/auth/register | POST | 用户注册 | ✅ |
| | /api/auth/login | POST | 用户登录 | ✅ |
| | /api/auth/me | GET | 获取当前用户 | ✅ |
| | /api/auth/refresh | POST | 刷新 Token | ✅ |
| **计划** | /api/plans/current | GET | 获取当前计划 | ✅ |
| | /api/plans/my | GET | 获取我的计划 | ✅ |
| | /api/plans/:id | GET | 获取计划详情 | ✅ |
| | /api/plans/:id/days/:day | GET | 获取某日训练详情 | ✅ |

> **注意**: 进度/统计模块的 API 尚未实现，当前为前端模拟数据

### 4.2 认证模块

#### POST /api/auth/register - 用户注册

**请求**:
```json
{
  "username": "testuser",
  "password": "password123",
  "confirmPassword": "password123",
  "nickname": "测试用户"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null,
      "createdAt": "2026-03-03T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

**错误码**:
- `USERNAME_EXISTS` - 用户名已存在
- `USERNAME_INVALID` - 用户名格式不正确（4-20字符，字母数字下划线）
- `PASSWORD_INVALID` - 密码格式不正确（6-20字符，至少包含字母和数字）
- `PASSWORD_MISMATCH` - 两次密码不一致

---

#### POST /api/auth/login - 用户登录

**请求**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

**错误码**:
- `USER_NOT_FOUND` - 用户不存在
- `PASSWORD_ERROR` - 密码错误

---

#### GET /api/auth/me - 获取当前用户

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": null,
    "createdAt": "2026-03-03T10:00:00Z"
  }
}
```

---

#### POST /api/auth/refresh - 刷新 Token

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

---

### 4.3 计划模块

#### GET /plans/current - 获取本周计划

**请求头**:
```
Authorization: Bearer <token>
```

**查询参数**:
```
?date=2026-02-28 (可选，默认本周)
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "plan-uuid",
    "weekNumber": 9,
    "year": 2026,
    "days": [
      {
        "dayOfWeek": 0,
        "date": "2026-02-23",
        "isRestDay": true,
        "label": "休息"
      },
      {
        "dayOfWeek": 1,
        "date": "2026-02-24",
        "isRestDay": false,
        "label": "胸肌训练",
        "exerciseCount": 4
      },
      // ... 7天
    ]
  }
}
```

---

#### GET /plans/:id/days/:day - 获取某日训练详情

**响应**:
```json
{
  "success": true,
  "data": {
    "dayOfWeek": 1,
    "date": "2026-02-24",
    "isRestDay": false,
    "exercises": [
      {
        "id": "exercise-uuid-1",
        "name": "哑铃卧推",
        "sets": 4,
        "reps": 12,
        "restSeconds": 60,
        "videoUrl": "https://cdn.example.com/video1.mp4",
        "order": 1
      },
      {
        "id": "exercise-uuid-2",
        "name": "哑铃飞鸟",
        "sets": 3,
        "reps": 15,
        "restSeconds": 45,
        "videoUrl": "https://cdn.example.com/video2.mp4",
        "order": 2
      }
      // ...
    ],
    "progress": {
      "isCompleted": false,
      "completedSets": {
        "exercise-uuid-1": 2
      }
    }
  }
}
```

---

### 4.4 进度模块

#### POST /progress/checkin - 完成打卡

**请求**:
```json
{
  "planId": "plan-uuid",
  "date": "2026-02-24"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "progress-uuid",
    "isCompleted": true,
    "completedAt": "2026-02-24T20:30:00Z"
  }
}
```

---

#### POST /progress/set-complete - 完成一组动作

**请求**:
```json
{
  "planId": "plan-uuid",
  "date": "2026-02-24",
  "exerciseId": "exercise-uuid-1",
  "setNumber": 1
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "exerciseId": "exercise-uuid-1",
    "completedSets": 1,
    "totalSets": 4,
    "isExerciseComplete": false
  }
}
```

---

#### GET /progress/today - 获取今日进度

**响应**:
```json
{
  "success": true,
  "data": {
    "date": "2026-02-24",
    "isCompleted": false,
    "exercises": [
      {
        "id": "exercise-uuid-1",
        "name": "哑铃卧推",
        "completedSets": 2,
        "totalSets": 4
      }
      // ...
    ]
  }
}
```

---

### 4.5 统计模块

#### GET /stats/weekly - 周统计

**查询参数**:
```
?weekNumber=9&year=2026
```

**响应**:
```json
{
  "success": true,
  "data": {
    "weekNumber": 9,
    "year": 2026,
    "totalDays": 7,
    "completedDays": 3,
    "completionRate": 0.43,
    "totalExercises": 20,
    "completedExercises": 12,
    "checkins": [
      {
        "date": "2026-02-24",
        "isCompleted": true
      }
      // ...
    ]
  }
}
```

---

### 4.6 统一响应格式

**成功**:
```json
{
  "success": true,
  "data": { ... }
}
```

**失败**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

**错误码**:
- `UNAUTHORIZED` - 未授权（401）
- `INVALID_TOKEN` - Token 无效
- `INVALID_PARAMS` - 参数错误（400）
- `NOT_FOUND` - 资源不存在（404）
- `INTERNAL_ERROR` - 服务器错误（500）

---

## 5. 目录结构

### 5.1 后端目录（Node.js）

```
backend/
├── src/
│   ├── config/              # 配置文件
│   │   ├── index.js         # 配置入口
│   │   ├── database.js      # 数据库配置
│   │   └── wechat.js        # 微信配置
│   │
│   ├── prisma/              # Prisma 相关
│   │   ├── schema.prisma    # 数据模型
│   │   └── migrations/      # 迁移文件
│   │
│   ├── middlewares/         # 中间件
│   │   ├── auth.js          # JWT 认证
│   │   ├── errorHandler.js  # 错误处理
│   │   └── validator.js     # 参数校验
│   │
│   ├── routes/              # 路由
│   │   ├── index.js         # 路由入口
│   │   ├── auth.js          # 认证路由
│   │   ├── plans.js         # 计划路由
│   │   ├── progress.js      # 进度路由
│   │   └── stats.js         # 统计路由
│   │
│   ├── services/            # 业务逻辑
│   │   ├── wechat.js        # 微信服务
│   │   ├── auth.js          # 认证服务
│   │   ├── plan.js          # 计划服务
│   │   ├── progress.js      # 进度服务
│   │   └── stats.js         # 统计服务
│   │
│   ├── utils/               # 工具函数
│   │   ├── jwt.js           # JWT 工具
│   │   ├── response.js      # 响应格式化
│   │   └── logger.js        # 日志工具
│   │
│   └── app.js               # Koa 应用入口
│
├── .env                     # 环境变量
├── .env.example             # 环境变量示例
├── package.json
└── README.md
```

---

### 5.2 前端目录（React Native）

```
mobile/
├── src/
│   ├── screens/             # 页面
│   │   ├── LoginScreen.js         # 登录页
│   │   ├── HomeScreen.js          # 首页（周计划）
│   │   ├── TrainingDetailScreen.js # 训练详情
│   │   ├── TrainingModeScreen.js  # 训练模式
│   │   ├── StatsScreen.js         # 统计页
│   │   └── SettingsScreen.js      # 设置页
│   │
│   ├── components/          # 组件
│   │   ├── common/                # 通用组件
│   │   │   ├── Button.js
│   │   │   ├── Loading.js
│   │   │   └── VideoPlayer.js
│   │   ├── PlanCard.js            # 计划卡片
│   │   ├── ExerciseItem.js        # 动作项
│   │   └── ProgressCalendar.js    # 打卡日历
│   │
│   ├── navigation/          # 导航
│   │   ├── AppNavigator.js        # 导航配置
│   │   └── AuthNavigator.js       # 认证导航
│   │
│   ├── store/               # 状态管理（Zustand）
│   │   ├── useAuthStore.js        # 认证状态
│   │   ├── usePlanStore.js        # 计划状态
│   │   └── useProgressStore.js    # 进度状态
│   │
│   ├── services/            # API 服务
│   │   ├── api.js                 # Axios 实例
│   │   ├── authService.js         # 认证 API
│   │   ├── planService.js         # 计划 API
│   │   └── progressService.js     # 进度 API
│   │
│   ├── utils/               # 工具函数
│   │   ├── storage.js             # 本地存储
│   │   ├── pushNotification.js    # 推送通知
│   │   └── wechat.js              # 微信 SDK 封装
│   │
│   ├── constants/           # 常量
│   │   ├── colors.js              # 颜色
│   │   └── config.js              # 配置
│   │
│   └── App.js               # 应用入口
│
├── android/                 # Android 原生代码
├── ios/                     # iOS 原生代码
├── package.json
└── README.md
```

---

## 6. 技术风险与应对

### 6.1 高风险 🔴

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| **微信开放平台审核** | 可能延期上线 | 提前申请，准备测试账号 |
| **react-native-wechat-lib 原生配置** | 首次集成困难 | 预留 0.5 天调试时间 |
| **视频资源缺失** | 核心功能不可用 | Day 1 先用 Mock 数据，Day 2 集成视频 |

### 6.2 中风险 🟡

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| **SQLite 并发限制** | 多用户同时打卡可能失败 | MVP 单用户场景影响小 |
| **微信 access_token 缓存** | 频繁调用可能被限制 | 使用内存缓存，2 小时刷新 |
| **视频流量成本** | CDN 费用 | MVP 使用免费视频链接 |

### 6.3 低风险 🟢

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| **JWT Token 过期** | 用户需重新登录 | 设置 7 天有效期，自动刷新 |
| **推送通知权限** | 部分用户拒绝 | 提供"稍后提醒"选项 |
| **数据迁移** | SQLite → PostgreSQL | Prisma 支持无缝迁移 |

---

## 7. 开发时间估算

| 模块 | 后端 | 前端 | 总计 |
|------|------|------|------|
| **认证模块** | 0.5 天 | 0.5 天 | 1 天 |
| **计划模块** | 0.5 天 | 1 天 | 1.5 天 |
| **进度模块** | 0.5 天 | 1 天 | 1.5 天 |
| **统计模块** | 0.25 天 | 0.5 天 | 0.75 天 |
| **推送通知** | - | 0.5 天 | 0.5 天 |
| **视频集成** | 0.25 天 | 0.5 天 | 0.75 天 |
| **测试打磨** | 0.5 天 | 0.5 天 | 1 天 |
| **总计** | **2.5 天** | **4.5 天** | **7 天** |

**并行开发后：3 天完成**（后端 + 前端并行）

---

## 8. 部署方案

### 8.1 后端部署

**方案一：传统部署（推荐 MVP）**
- 服务器：阿里云 ECS / 腾讯云 CVM
- 运行：PM2 管理 Node.js 进程
- 数据库：SQLite 文件 + 定期备份
- 域名：配置 HTTPS

**方案二：Serverless（未来考虑）**
- 阿里云函数计算 / 腾讯云 SCF
- 适合低成本、按需付费

### 8.2 前端发布

**Android**:
- 打包 APK
- 上传到应用商店（需审核）
- 或提供下载链接

**iOS**:
- 暂不考虑（MVP 仅 Android）

---

## 9. 后续优化方向

### 9.1 性能优化
- [ ] 视频预加载
- [ ] 图片懒加载
- [ ] 数据缓存策略
- [ ] 离线模式支持

### 9.2 功能扩展
- [ ] 个性化计划推荐
- [ ] 社交分享
- [ ] 数据导出
- [ ] 更多训练计划模板

### 9.3 技术升级
- [ ] SQLite → PostgreSQL
- [ ] 添加 Redis 缓存
- [ ] 引入 Elasticsearch（搜索功能）
- [ ] 监控与告警（Sentry）

---

## 附录

### A. 环境变量配置

**后端 .env**:
```bash
# 服务配置
PORT=3000
NODE_ENV=development

# 微信配置
WECHAT_APPID=wx1234567890abcdef
WECHAT_APPSECRET=your_app_secret

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 数据库
DATABASE_URL="file:./dev.db"
```

### B. 快速启动命令

**后端**:
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**前端**:
```bash
cd mobile
npm install
npm run android
```

---

**文档维护**: 随项目进展持续更新  
**反馈**: 如有疑问联系架构师 梁构
