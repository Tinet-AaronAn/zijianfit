# ZijianFit CI/CD 配置指南

## 📋 概述

本项目使用 GitHub Actions 实现自动化 CI/CD 流水线：
- **后端**: 测试 → 构建 Docker 镜像 → 推送到 ghcr.io → 部署到腾讯云服务器
- **移动端**: 测试 → 构建 APK → 发布到 GitHub Releases

---

## 🔧 配置步骤

### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

**路径**: Settings → Secrets and variables → Actions → New repository secret

#### 服务器相关
| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_HOST` | 腾讯云服务器 IP | `123.45.67.89` |
| `SERVER_PORT` | SSH 端口 | `22`（默认） |
| `SERVER_USER` | SSH 用户名 | `root` 或 `ubuntu` |
| `SERVER_SSH_KEY` | SSH 私钥 | `-----BEGIN RSA PRIVATE KEY-----...` |

#### 后端相关
| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `JWT_SECRET` | JWT 密钥 | `your-secret-key-here` |
| `BACKEND_PORT` | 后端监听端口 | `3001`（默认） |

#### 通知相关（可选）
| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | `123456:ABC-DEF...` |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID | `-100123456789` |

---

### 2. 获取 SSH 私钥

#### 方式 A：生成新的 SSH 密钥对（推荐）

```bash
# 生成新的 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions@zijianfit" -f zijianfit-deploy

# 会生成两个文件：
# - zijianfit-deploy (私钥，添加到 GitHub Secrets)
# - zijianfit-deploy.pub (公钥，添加到服务器)
```

#### 方式 B：使用现有密钥

```bash
# 查看私钥
cat ~/.ssh/id_rsa

# 查看公钥
cat ~/.ssh/id_rsa.pub
```

---

### 3. 配置服务器

#### 3.1 添加公钥到服务器

```bash
# 在本地执行（将公钥添加到服务器）
ssh-copy-id -i zijianfit-deploy.pub user@your-server-ip

# 或者手动添加
ssh user@your-server-ip
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ... github-actions@zijianfit" >> ~/.ssh/authorized_keys
```

#### 3.2 创建应用目录

```bash
# SSH 到服务器
ssh user@your-server-ip

# 创建目录
mkdir -p /opt/zijianfit/{data,videos}

# 设置权限
chmod 755 /opt/zijianfit
chmod 755 /opt/zijianfit/data
chmod 755 /opt/zijianfit/videos
```

#### 3.3 配置防火墙（如果需要）

```bash
# 开放后端端口
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload

# 或者使用 ufw
sudo ufw allow 3001/tcp
sudo ufw reload
```

---

### 4. 测试 CI/CD

#### 4.1 触发后端流水线

```bash
# 在本地修改后端代码
cd backend
# 修改文件...

# 提交并推送
git add .
git commit -m "feat: test backend CI/CD"
git push origin main
```

#### 4.2 触发移动端流水线

```bash
# 在本地修改移动端代码
cd mobile
# 修改文件...

# 提交并推送
git add .
git commit -m "feat: test mobile CI/CD"
git push origin main
```

#### 4.3 查看 GitHub Actions 日志

访问: `https://github.com/Tinet-AaronAn/zijianfit/actions`

---

## 📊 流水线说明

### 后端流水线 (`backend-ci-cd.yml`)

#### 触发条件
- `main` 分支 push
- 修改 `backend/**` 文件

#### 流程
1. **测试阶段**
   - 安装依赖
   - 运行单元测试

2. **构建阶段**
   - 构建 Docker 镜像
   - 推送到 `ghcr.io/tinet-aaronan/zijianfit/backend:latest`

3. **部署阶段**
   - SSH 到腾讯云服务器
   - 拉取最新镜像
   - 停止旧容器
   - 启动新容器
   - 健康检查

4. **通知阶段**
   - 成功/失败通知到 Telegram

---

### 移动端流水线 (`mobile-ci-cd.yml`)

#### 触发条件
- `main` 分支 push
- 修改 `mobile/**` 文件

#### 流程
1. **测试阶段**
   - 安装依赖
   - 运行 Lint 检查
   - 运行单元测试

2. **构建阶段**
   - 构建 Debug APK
   - 构建 Release APK
   - 上传到 Artifacts

3. **发布阶段**
   - 创建 GitHub Release
   - 版本号: `v1.0.{run_number}`
   - 附带 APK 文件

4. **通知阶段**
   - 成功/失败通知到 Telegram

---

## 🔍 验证部署

### 后端验证

```bash
# SSH 到服务器
ssh user@your-server-ip

# 查看容器状态
docker ps | grep zijianfit-backend

# 查看容器日志
docker logs zijianfit-backend

# 健康检查
curl http://localhost:3001/health

# 从外部访问（替换为您的服务器 IP）
curl http://123.45.67.89:3001/health
```

### 移动端验证

访问 GitHub Releases 页面：
`https://github.com/Tinet-AaronAn/zijianfit/releases`

下载最新的 APK 文件，在手机上安装测试。

---

## 🛠️ 常见问题

### 1. SSH 连接失败

**错误**: `Permission denied (publickey)`

**解决**:
```bash
# 检查公钥是否添加到服务器
ssh user@your-server-ip "cat ~/.ssh/authorized_keys"

# 检查私钥格式（GitHub Secrets 中）
# 必须包含完整的 BEGIN 和 END 行
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

### 2. Docker 镜像拉取失败

**错误**: `unauthorized: authentication required`

**解决**:
```bash
# SSH 到服务器
# 登录 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 或者使用 GitHub PAT
docker login ghcr.io -u Tinet-AaronAn
# 输入 Personal Access Token（需要 read:packages 权限）
```

### 3. 容器启动失败

**错误**: `container xxxx is not running`

**解决**:
```bash
# 查看容器日志
docker logs zijianfit-backend

# 常见问题：
# 1. 数据库文件权限问题
chmod 666 /opt/zijianfit/data/prod.db

# 2. 端口被占用
lsof -i :3001
kill -9 <PID>

# 3. 环境变量缺失
docker inspect zijianfit-backend | grep -A 10 Env
```

### 4. APK 构建失败

**错误**: `Execution failed for task ':app:processDebugResources'`

**解决**:
```bash
# 本地测试构建
cd mobile/android
./gradlew assembleDebug

# 检查 Android SDK 版本
echo $ANDROID_HOME
```

---

## 🔐 安全建议

1. **SSH 密钥管理**
   - 为 CI/CD 生成专用 SSH 密钥对
   - 不要使用个人 SSH 密钥
   - 定期更换密钥（建议 3 个月）

2. **JWT Secret**
   - 使用强随机字符串（至少 32 字符）
   - 定期更换（建议 6 个月）

3. **GitHub Token**
   - 使用最小权限原则
   - 定期检查并撤销未使用的 Token

4. **服务器安全**
   - 禁用密码登录，只允许 SSH Key
   - 修改默认 SSH 端口（可选）
   - 配置防火墙，只开放必要端口

---

## 📝 维护指南

### 手动触发部署

如果需要手动触发部署，可以：

1. 在 GitHub Actions 页面点击 "Run workflow"
2. 或者推送一个空提交：
```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

### 回滚到之前的版本

```bash
# SSH 到服务器
ssh user@your-server-ip

# 查看历史镜像
docker images | grep zijianfit/backend

# 停止当前容器
docker stop zijianfit-backend
docker rm zijianfit-backend

# 使用之前的镜像启动
docker run -d \
  --name zijianfit-backend \
  --restart unless-stopped \
  -p 3001:3001 \
  -v /opt/zijianfit/data:/app/data \
  -v /opt/zijianfit/videos:/app/public/videos \
  ghcr.io/tinet-aaronan/zijianfit/backend@sha256:xxx
```

### 更新 JWT Secret

```bash
# 1. 在 GitHub 仓库设置中更新 JWT_SECRET

# 2. 触发重新部署
git commit --allow-empty -m "chore: rotate JWT secret"
git push origin main

# 或者手动重启容器
ssh user@your-server-ip
docker restart zijianfit-backend
```

---

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

🦞 **随行** - 2026-03-09
