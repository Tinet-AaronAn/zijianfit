# 🐳 Docker 部署指南

**项目**: 自健身 App Backend  
**版本**: 1.0.0  
**最后更新**: 2026-03-09

---

## 📋 前置要求

- [x] Docker 20.10+
- [x] Docker Compose 2.0+（可选）
- [x] 服务器至少 512MB 内存
- [x] 端口 3001 可用

---

## 🚀 快速开始

### 方式 1: 使用 Docker Compose（推荐）

#### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
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
      - ./backend/public:/app/public:ro
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

# 检查状态
docker-compose ps
```

#### 3. 初始化数据库

```bash
# 进入容器
docker-compose exec backend sh

# 运行迁移
npx prisma migrate deploy

# （可选）填充初始数据
npx prisma db seed

# 退出容器
exit
```

---

### 方式 2: 使用 Docker 命令

#### 1. 构建镜像

```bash
cd backend

# 构建镜像
docker build -t zijianfit-backend:latest .
```

#### 2. 创建数据目录

```bash
# 在宿主机创建数据目录
mkdir -p $(pwd)/data
```

#### 3. 运行容器

```bash
docker run -d \
  --name zijianfit-backend \
  --restart unless-stopped \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:/app/data/prod.db \
  -e JWT_SECRET=your-super-secret-key-change-this-in-production \
  -e CORS_ORIGIN="*" \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public:/app/public:ro \
  zijianfit-backend:latest
```

#### 4. 初始化数据库

```bash
# 进入容器
docker exec -it zijianfit-backend sh

# 运行迁移
npx prisma migrate deploy

# 退出容器
exit
```

---

## 🔧 环境变量配置

### 必需变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `production` | `production` |
| `DATABASE_URL` | 数据库连接 | `file:/app/data/prod.db` | `file:/app/data/prod.db` |
| `JWT_SECRET` | JWT 密钥 | - | `your-secret-key-32-chars` |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | `3001` |
| `CORS_ORIGIN` | CORS 允许源 | `*` |

---

## 📂 数据持久化

### 目录结构

```
zijianfit/
├── backend/
│   ├── Dockerfile
│   ├── public/          # 视频资源（只读挂载）
│   └── ...
├── data/                # 数据库文件（持久化）
│   └── prod.db
└── docker-compose.yml
```

### 备份数据库

```bash
# 创建备份
docker-compose exec backend sh -c "sqlite3 /app/data/prod.db '.backup /app/data/backup.db'"

# 复制到宿主机
docker cp zijianfit-backend:/app/data/backup.db ./backup_$(date +%Y%m%d).db
```

### 恢复数据库

```bash
# 复制备份文件到容器
docker cp ./backup_20260309.db zijianfit-backend:/app/data/restore.db

# 恢复
docker-compose exec backend sh -c "sqlite3 /app/data/prod.db '.restore /app/data/restore.db'"
```

---

## 🔄 更新部署

### 更新代码

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f backend
```

### 零停机更新

```bash
# 构建新镜像
docker-compose build backend

# 优雅重启
docker-compose up -d --no-deps --build backend
```

---

## 🐛 故障排查

### 1. 容器无法启动

```bash
# 查看日志
docker-compose logs backend

# 查看容器状态
docker-compose ps

# 进入容器调试
docker-compose exec backend sh
```

### 2. Prisma 错误

```bash
# 重新生成 Prisma Client
docker-compose exec backend sh -c "npx prisma generate"

# 检查数据库连接
docker-compose exec backend sh -c "npx prisma db push --preview-feature"
```

### 3. 数据库错误

```bash
# 检查数据库文件
docker-compose exec backend sh -c "ls -la /app/data/"

# 检查数据库完整性
docker-compose exec backend sh -c "sqlite3 /app/data/prod.db 'PRAGMA integrity_check;'"
```

### 4. 权限错误

```bash
# 修复数据目录权限
sudo chown -R 1001:1001 ./data
```

---

## 📊 性能优化

### 1. 资源限制

在 `docker-compose.yml` 中添加：

```yaml
services:
  backend:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 2. 日志限制

```yaml
services:
  backend:
    # ... 其他配置
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 🔒 安全建议

### 1. 使用 HTTPS

配合 Nginx 反向代理：

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 限制 CORS

```yaml
environment:
  - CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### 3. 使用强密钥

```bash
# 生成强密钥
openssl rand -base64 32

# 在 docker-compose.yml 中使用
environment:
  - JWT_SECRET=<generated-secret>
```

---

## 📦 Docker Hub 发布（可选）

### 1. 构建并推送

```bash
# 登录 Docker Hub
docker login

# 构建镜像
docker build -t yourusername/zijianfit-backend:latest .
docker build -t yourusername/zijianfit-backend:1.0.0 .

# 推送镜像
docker push yourusername/zijianfit-backend:latest
docker push yourusername/zijianfit-backend:1.0.0
```

### 2. 使用镜像

```yaml
services:
  backend:
    image: yourusername/zijianfit-backend:latest
    # ... 其他配置
```

---

## ✅ 部署验证

### 健康检查

```bash
# 检查健康状态
curl http://localhost:3001/health

# 检查 API 信息
curl http://localhost:3001/

# 检查视频资源
curl -I http://localhost:3001/videos/upper-body.mp4
```

### 性能测试

```bash
# 简单压力测试
ab -n 1000 -c 100 http://localhost:3001/health
```

---

## 📞 支持

**问题反馈**: GitHub Issues  
**技术支持**: 随行 AI 🦞

---

**部署完成！** 🎉
