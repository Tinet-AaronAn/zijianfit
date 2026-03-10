# Codeup 迁移指南

## 📋 概述

本项目已从 GitHub 迁移到阿里云 Codeup，包括：
- ✅ 代码仓库
- ✅ CI/CD 流水线
- ✅ 容器镜像仓库

---

## 🚀 首次配置

### 1. 登录镜像仓库（服务器上执行）

```bash
docker login --username=anjb@1023277463091071 registry.cn-beijing.aliyuncs.com
# 输入密码
```

### 2. 推送代码到 Codeup

```bash
# 添加 Codeup remote
cd /Users/aaronan/.openclaw/workspace/projects/zijianfit
git remote add codeup https://codeup.aliyun.com/62258144557537532aa0fd6a/anjb.git

# 推送所有分支
git push codeup --all

# 推送所有标签
git push codeup --tags
```

### 3. 配置 Codeup 流水线

#### 3.1 创建流水线

1. 访问 Codeup 控制台
2. 进入项目 `anjb`
3. 点击「流水线」→「新建流水线」
4. 选择「YAML 模式」
5. 分别创建两个流水线：
   - **backend-ci-cd**: 选择 `.cloud/.codeup/pipelines/backend-ci-cd.yml`
   - **mobile-ci-cd**: 选择 `.cloud/.codeup/pipelines/mobile-ci-cd.yml`

#### 3.2 配置变量

在流水线设置中添加以下变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PIPELINE_ID` | 镜像仓库用户名 | `anjb@1023277463091071` |
| `PIPELINE_TOKEN` | 镜像仓库密码 | `xxx`（从阿里云控制台获取） |

**获取镜像仓库密码：**
1. 访问 [阿里云容器镜像服务](https://cr.console.aliyun.com/)
2. 左侧菜单 → 访问凭证
3. 设置固定密码（不是阿里云登录密码）

---

## 📦 服务器部署

### 首次部署

```bash
# 1. 创建项目目录
mkdir -p /root/zijianfit/data
mkdir -p /root/zijianfit/public/videos

# 2. 上传 docker-compose.yml
cat > /root/zijianfit/docker-compose.yml << 'EOF'
services:
  backend:
    image: registry.cn-beijing.aliyuncs.com/anjb/zijianfit-backend:latest
    container_name: zijianfit-backend
    restart: unless-stopped
    ports:
      - "${PORT:-3001}:${PORT:-3001}"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${PORT:-3001}
      - DATABASE_URL=${DATABASE_URL:-file:/app/data/prod.db}
      - JWT_SECRET=${JWT_SECRET:?JWT_SECRET is required}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}
      - CORS_ORIGIN=${CORS_ORIGIN:-*}
    volumes:
      - ${DATA_PATH:-./data}:/app/data
      - ${PUBLIC_PATH:-./public}:/app/public:ro
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:${PORT:-3001}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s

networks:
  default:
    name: zijianfit-network
EOF

# 3. 创建环境变量文件
cat > /root/zijianfit/.env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key-here-change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
DATA_PATH=./data
PUBLIC_PATH=./public
EOF

# 4. 登录镜像仓库
docker login --username=anjb@1023277463091071 registry.cn-beijing.aliyuncs.com

# 5. 启动服务
cd /root/zijianfit
docker compose up -d
```

### 更新部署

```bash
cd /root/zijianfit

# 停止旧容器
docker compose down

# 拉取最新镜像
docker pull registry.cn-beijing.aliyuncs.com/anjb/zijianfit-backend:latest

# 启动新容器
docker compose up -d

# 查看日志
docker compose logs -f
```

---

## 🔍 验证

### 后端健康检查

```bash
# 本地检查
curl http://localhost:3001/health

# 外部访问（替换为服务器 IP）
curl http://你的服务器IP:3001/health
```

### 查看容器状态

```bash
docker ps | grep zijianfit-backend
docker logs zijianfit-backend
```

---

## 📊 流水线触发

### 自动触发

- **后端流水线**: 修改 `backend/**` 文件并推送到 `main` 分支
- **移动端流水线**: 修改 `mobile/**` 文件并推送到 `main` 分支

### 手动触发

1. 访问 Codeup 控制台
2. 进入「流水线」
3. 选择对应流水线
4. 点击「运行」

---

## 🔧 故障排查

### 1. 镜像拉取失败

```bash
# 检查是否登录
cat ~/.docker/config.json | grep registry.cn-beijing.aliyuncs.com

# 重新登录
docker logout registry.cn-beijing.aliyuncs.com
docker login --username=anjb@1023277463091071 registry.cn-beijing.aliyuncs.com
```

### 2. 容器启动失败

```bash
# 查看详细日志
docker compose logs backend

# 进入容器调试
docker exec -it zijianfit-backend sh

# 检查环境变量
docker inspect zijianfit-backend | grep -A 10 Env
```

### 3. 流水线失败

1. 检查 YAML 语法
2. 检查变量是否配置
3. 查看流水线日志

---

## 📝 常用命令

```bash
# 查看所有容器
docker ps -a

# 查看镜像
docker images | grep zijianfit

# 重启容器
docker restart zijianfit-backend

# 查看日志
docker compose logs -f --tail=100

# 进入容器
docker exec -it zijianfit-backend sh

# 清理旧镜像
docker image prune -a
```

---

## 🆚 GitHub vs Codeup 对比

| 功能 | GitHub | Codeup |
|------|--------|--------|
| 代码仓库 | github.com | codeup.aliyun.com |
| 流水线 | GitHub Actions | Codeup 流水线 |
| 镜像仓库 | ghcr.io | registry.cn-beijing.aliyuncs.com |
| 访问速度 | 国外，慢 | 国内，快 |
| 配置文件 | `.github/workflows/*.yml` | `.cloud/.codeup/pipelines/*.yml` |

---

## 🎯 下一步

1. ✅ 推送代码到 Codeup
2. ✅ 配置流水线变量
3. ✅ 触发第一次构建
4. ✅ 验证部署成功

---

🦞 随行 - 2026-03-10
