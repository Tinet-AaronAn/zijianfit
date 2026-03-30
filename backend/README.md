# 自健身 Backend

面向家庭健身用户的健身计划管理工具 - 后端服务

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Koa 2.x
- **数据库**: SQLite 3.x（通过 Prisma ORM）
- **认证**: JWT（JSON Web Token）
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `PORT`: 服务端口（默认 3001）
- `JWT_SECRET`: JWT 密钥（必填，生产环境必须修改）
- `DATABASE_URL`: 数据库连接（默认 SQLite 本地文件）
- `NODE_ENV`: 运行环境（development / production）

### 3. 初始化数据库

```bash
# ① 生成 Prisma Client（必须先执行，否则代码无法引用数据库模型）
npm run prisma:generate

# ② 运行数据库迁移（创建表结构）
npm run prisma:migrate

# ③ 导入种子数据（训练计划 + 动作数据）
npm run prisma:seed
```

> **说明**：`npm run prisma:seed` 实际执行的是 `tsx prisma/seed.ts`，它会读取 `data/seed-plan-45.json` 中的训练计划数据并导入数据库。这是初始化训练计划数据的主要方式。

### 4. 启动服务器

```bash
# 开发模式（热重载，修改代码自动重启）
npm run dev

# 生产模式（先编译再运行）
npm run build    # TypeScript → JavaScript，输出到 dist/
npm start        # 运行 dist/server.js
```

服务器将在 http://localhost:3001 启动

### 5. 可视化管理数据库（可选）

```bash
# 打开 Prisma Studio，在浏览器中查看和编辑数据库
npm run prisma:studio
# 访问 http://localhost:5555
```

## API 接口

### 基础接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | API 信息 | 无需 |
| GET | `/health` | 健康检查 | 无需 |

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 无需 |
| POST | `/api/auth/login` | 用户登录 | 无需 |
| GET | `/api/auth/me` | 获取当前用户信息 | 需要 |
| POST | `/api/auth/refresh` | 刷新 Token | 需要 |

### 训练计划接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/plans/current` | 获取当前周训练计划 | 可选 |
| GET | `/api/plans/:planId` | 获取计划详情 | 可选 |
| GET | `/api/plans/:planId/days/:dayOfWeek` | 获取某日训练详情 | 可选 |

### 管理接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/admin/seed` | 远程导入训练计划种子数据 | 无需 |

> **`POST /api/admin/seed` 说明**：在服务器上远程导入训练计划数据，无需 SSH 登录。
> 这是一个幂等操作，重复调用会先清除旧数据再重新导入。
> 调用方式：`curl -X POST http://localhost:3001/api/admin/seed`

### 静态资源

| 路径 | 说明 |
|------|------|
| `/videos/upper-body.mp4` | 上肢力量训练跟练视频 |
| `/videos/lower-body.mp4` | 下肢力量训练跟练视频 |

## 视频资源

视频文件位于 `public/videos/` 目录，通过 Koa 静态文件服务提供访问。

### 文件规范

| 文件名 | 用途 | 对应训练日 | 轮数 |
|--------|------|-----------|------|
| `upper-body.mp4` | 上肢力量训练 | 周一、周二、周五、周日 | 3-4轮 |
| `lower-body.mp4` | 下肢力量训练 | 周三、周六 | 3轮 |

> ⚠️ 视频文件（*.mp4）不提交到 Git，通过直接上传到服务器部署。
> 已在 `.gitignore` 中配置忽略 `backend/public/videos/*.mp4`。

### 服务器部署视频

```bash
# 1. 上传视频到服务器（docker-compose.yml 同级目录）
scp public/videos/*.mp4 <服务器>:/path/to/zijianfit/public/videos/

# 2. 重启容器（volume 挂载了 ./public，无需重建镜像）
docker compose restart

# 3. 验证视频可访问
curl -I http://localhost:3001/videos/upper-body.mp4
```

## 数据库管理

### 查看和编辑数据

```bash
# 启动 Prisma Studio 可视化界面
npm run prisma:studio
# 浏览器打开 http://localhost:5555
```

### 数据库迁移（修改表结构时使用）

```bash
# 创建新迁移（开发环境，会自动应用）
npx prisma migrate dev --name migration_name

# 应用迁移（生产环境，只应用不创建）
npx prisma migrate deploy
```

### 其他 Seed 脚本

`prisma/` 目录下有多个 seed 相关脚本，按需使用：

| 脚本 | 用途 | 运行方式 |
|------|------|---------|
| `seed.ts` | 主 seed 脚本，读取 JSON 导入训练计划 | `npm run prisma:seed` |
| `seed-new-plan.ts` | 硬编码的 45 岁健身计划数据 | `npx tsx prisma/seed-new-plan.ts` |
| `clear-old-plan.ts` | 清除旧计划数据 | `npx tsx prisma/clear-old-plan.ts` |
| `update-video-urls*.ts` | 更新视频链接 | `npx tsx prisma/update-video-urls.ts` |

## 项目结构

```
backend/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义（User, Plan, DayPlan, Exercise）
│   ├── seed.ts                # 主 seed 脚本（npm run prisma:seed 执行这个）
│   ├── seed-new-plan.ts       # 备用 seed 脚本（硬编码数据，不读 JSON）
│   ├── clear-old-plan.ts      # 清除旧计划
│   ├── update-video-urls*.ts  # 更新视频链接的脚本们
│   ├── migrations/            # 数据库迁移文件
│   ├── dev.db                 # 本地开发数据库（git 已忽略）
│   └── test.db                # 测试数据库
├── src/
│   ├── config/
│   │   └── index.ts           # 配置管理（读取 .env）
│   ├── controllers/
│   │   ├── auth.controller.ts # 认证逻辑（注册、登录、获取用户）
│   │   └── plans.controller.ts# 训练计划逻辑（获取计划、获取每日训练）
│   ├── middleware/
│   │   ├── auth.ts            # JWT 认证中间件
│   │   ├── error.ts           # 统一错误处理
│   │   ├── security.ts        # 安全头部
│   │   └── rateLimit.ts       # 请求频率限制
│   ├── routes/
│   │   ├── auth.ts            # 认证路由（/api/auth/*）
│   │   ├── plans.ts           # 训练计划路由（/api/plans/*）
│   │   └── admin.ts           # 管理路由（/api/admin/seed）
│   ├── utils/
│   │   └── response.ts        # 统一响应格式工具
│   ├── app.ts                 # Koa 应用配置（中间件、路由注册、静态文件）
│   └── server.ts              # 服务器启动入口
├── data/
│   └── seed-plan-45.json      # 训练计划 JSON 数据（seed.ts 读取此文件）
├── public/
│   └── videos/
│       ├── upper-body.mp4     # 上肢力量训练视频（git 已忽略，需手动上传）
│       ├── lower-body.mp4     # 下肢力量训练视频（git 已忽略，需手动上传）
│       └── README.md          # 视频文件规范说明
├── .env                       # 环境变量（git 已忽略）
├── .env.example               # 环境变量示例
├── .env.docker.example        # Docker 部署环境变量示例
├── Dockerfile                 # Docker 镜像构建文件
├── docker-compose.yml         # Docker Compose 部署配置
├── package.json               # 项目依赖和脚本
├── tsconfig.json              # TypeScript 编译配置
├── jest.config.js             # 测试配置
├── API_EXAMPLES.md            # API 使用示例
└── README.md                  # 本文档
```

## 开发指南

### 代码规范

- 使用 TypeScript，所有代码有类型约束
- 遵循 RESTful API 设计
- 所有接口返回统一 JSON 格式
- 使用 Prisma ORM 操作数据库（不直接写 SQL）
- JWT 认证保护需要登录的接口

### 统一响应格式

**成功**:
```json
{
  "success": true,
  "message": "操作成功",
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

## 测试

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式（开发时使用）
npm run test:watch
```

详见 [API_EXAMPLES.md](./API_EXAMPLES.md)

## 部署

### 使用 Docker Compose（推荐）

#### 1. 配置环境变量

在服务器上创建 `.env` 文件：

```bash
cp .env.docker.example .env
# 编辑 .env，设置 JWT_SECRET 等必填项
```

**重要配置项**：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | 3001 |
| `JWT_SECRET` | JWT 密钥（**必填**） | - |
| `DATABASE_URL` | 数据库连接 | file:/app/data/prod.db |
| `CORS_ORIGIN` | CORS 允许源 | * |
| `DATA_PATH` | 数据库文件存储路径 | ./data |
| `PUBLIC_PATH` | 静态资源（视频）路径 | ./public |

**生成安全的 JWT_SECRET**：
```bash
openssl rand -base64 32
```

#### 2. 启动服务

```bash
# 构建并启动（后台运行）
docker compose up -d

# 查看日志（实时跟踪）
docker compose logs -f backend

# 查看容器状态
docker compose ps
```

#### 3. 初始化数据库（首次部署必做）

有两种方式，**选其一即可**：

**方式 A：进入容器内部执行**
```bash
# 进入容器
docker compose exec backend sh

# 在容器内运行迁移（创建表结构）
npx prisma migrate deploy

# 在容器内导入种子数据（训练计划数据）
npx tsx prisma/seed.ts

# 退出容器
exit
```

**方式 B：通过 HTTP API 远程导入（推荐，不需要进入容器）**
```bash
# 先确保迁移已执行
docker compose exec backend npx prisma migrate deploy

# 通过 HTTP API 远程导入训练计划数据
curl -X POST http://localhost:3001/api/admin/seed
# 返回 {"success":true,...} 表示成功
```

> ⚠️ **注意**：README 中此前的版本写了 `npx prisma db seed`，这是错误的。
> 正确的命令是 `npx tsx prisma/seed.ts`（在容器内）或通过 `POST /api/admin/seed`（远程调用）。
> 因为 package.json 中没有配置 `prisma.seed`，`npx prisma db seed` 会报错。

#### 4. 上传视频文件

视频文件不包含在 Docker 镜像和 Git 仓库中，需要手动上传：

```bash
# 确保服务器上有 videos 目录
mkdir -p public/videos

# 从本机上传视频到服务器
scp public/videos/upper-body.mp4 <服务器>:/path/to/zijianfit/public/videos/
scp public/videos/lower-body.mp4 <服务器>:/path/to/zijianfit/public/videos/

# 重启容器使视频生效（volume 挂载，无需重建镜像）
docker compose restart
```

#### 5. 验证部署

```bash
# 健康检查
curl http://localhost:3001/health

# 验证训练计划数据
curl http://localhost:3001/api/plans/current

# 验证视频文件
curl -I http://localhost:3001/videos/upper-body.mp4
```

#### 6. 日常维护

```bash
# 查看日志
docker compose logs -f

# 重启服务（更新视频后需要）
docker compose restart

# 停止服务
docker compose down

# 更新部署（拉取最新代码 + 重建镜像）
git pull
docker compose up -d --build

# 重新导入训练计划数据（通过 API）
curl -X POST http://localhost:3001/api/admin/seed
```

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 相关文档

- [PRD](../../docs/prd/PRD.md)
- [架构设计](../../docs/architecture/ARCHITECTURE.md)
- [技术栈](../../docs/architecture/TECH_STACK.md)
- [API 使用示例](./API_EXAMPLES.md)
- [视频资源规范](./public/videos/README.md)

## License

MIT

## 作者

安老师 - 一人开发、全栈开发实践

---

**最后更新**: 2026-03-30
