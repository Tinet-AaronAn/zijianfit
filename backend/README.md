# 自健身 Backend

面向家庭健身用户的健身计划管理工具 - 后端服务

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Koa 2.x
- **数据库**: SQLite 3.x
- **ORM**: Prisma 5.x
- **认证**: JWT
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
- `JWT_SECRET`: JWT 密钥（必填）
- `DATABASE_URL`: 数据库连接（默认 SQLite）
- `PORT`: 服务端口（默认 3001）

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 导入种子数据
npm run prisma:seed
```

### 4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

服务器将在 http://localhost:3001 启动

## API 接口

### 基础接口

- `GET /` - API 信息
- `GET /health` - 健康检查

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/refresh` - 刷新 Token

### 训练计划接口

- `GET /api/plans/current` - 获取当前周计划
- `GET /api/plans/:planId` - 获取计划详情
- `GET /api/plans/:planId/days/:dayOfWeek` - 获取某日训练

## 数据库管理

### 查看数据库

```bash
npm run prisma:studio
```

将在 http://localhost:5555 打开 Prisma Studio

### 数据库迁移

```bash
# 创建新迁移
npx prisma migrate dev --name migration_name

# 应用迁移
npx prisma migrate deploy
```

## 项目结构

```
backend/
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   ├── seed.ts            # 种子数据脚本
│   └── migrations/        # 迁移文件
├── src/
│   ├── config/            # 配置文件
│   │   └── index.ts
│   ├── controllers/       # 控制器
│   │   ├── auth.controller.ts
│   │   └── plans.controller.ts
│   ├── middleware/        # 中间件
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── routes/            # 路由
│   │   ├── auth.ts
│   │   └── plans.ts
│   ├── utils/             # 工具函数
│   │   └── response.ts
│   ├── app.ts             # Koa 应用
│   └── server.ts          # 服务器入口
├── data/                  # 数据文件
│   └── seed-plan-45.json  # 训练计划数据
├── .env                   # 环境变量
├── .env.example           # 环境变量示例
├── package.json
├── tsconfig.json
├── API_TEST.md            # API 测试文档
└── README.md
```

## 开发指南

### 代码规范

- 使用 TypeScript
- 遵循 RESTful API 设计
- 所有接口返回统一格式
- 使用 Prisma ORM 操作数据库
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

详见 [API_TEST.md](./API_TEST.md)

## 部署

### Docker Compose 部署

#### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: zijianfit-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/prod.db
      - JWT_SECRET=your-super-secret-key-change-this-in-production
      - CORS_ORIGIN=*
    volumes:
      - ./data:/app/data
      - ./public:/app/public:ro
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

#### 2. 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 初始化数据库（首次部署）
docker-compose exec backend sh
npx prisma migrate deploy
npx prisma db seed
exit

# 检查状态
docker-compose ps
```

#### 3. 验证部署

```bash
# 健康检查
curl http://localhost:3001/health

# API 信息
curl http://localhost:3001/
```

#### 4. 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

**注意**：
- 修改 `JWT_SECRET` 为强密钥（至少 32 字符）
- 数据库文件存储在 `./data` 目录
- 视频资源在 `./public` 目录

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 相关文档

- [PRD](../../docs/prd/PRD.md)
- [架构设计](../../docs/architecture/ARCHITECTURE.md)
- [技术栈](../../docs/architecture/TECH_STACK.md)
- [API 测试](./API_TEST.md)

## License

MIT

## 作者

安老师 - 一人开发、全栈开发实践

---

**最后更新**: 2026-03-09
