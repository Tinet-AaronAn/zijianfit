# 🚀 生产环境部署指南

**项目**: 自健身 App Backend  
**版本**: 1.0.0  
**最后更新**: 2026-03-03

---

## 📋 部署前检查清单

### 1. 环境准备
- [ ] Node.js >= 16.0.0
- [ ] npm >= 7.0.0
- [ ] PM2（推荐）或其他进程管理器
- [ ] 反向代理（Nginx 推荐）
- [ ] SSL 证书（HTTPS）

### 2. 配置检查
- [ ] 复制 `.env.production.example` 为 `.env.production`
- [ ] 配置强密码 JWT_SECRET（至少 32 字符）
- [ ] 配置微信 AppID 和 AppSecret
- [ ] 配置数据库连接（建议 PostgreSQL）
- [ ] 配置 CORS 域名
- [ ] 配置日志路径

### 3. 安全检查
- [ ] 确认 .env 文件不在 Git 中
- [ ] 确认敏感信息已加密
- [ ] 确认速率限制已启用
- [ ] 确认 CORS 配置正确
- [ ] 确认安全头部已启用

---

## 🔧 部署步骤

### Step 1: 代码准备
```bash
# 克隆代码
git clone <repository-url>
cd projects/zijianfit/backend

# 切换到生产分支
git checkout main

# 安装依赖
npm ci --production
```

### Step 2: 数据库配置

#### SQLite（开发/测试）
```bash
# 默认使用 SQLite
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
```

#### PostgreSQL（生产推荐）
```bash
# 1. 修改 .env.production
DATABASE_URL="postgresql://user:password@localhost:5432/zijianfit?schema=public"

# 2. 运行迁移
npx prisma migrate deploy

# 3. 生成 Prisma Client
npx prisma generate

# 4. 初始化数据
npx prisma db seed
```

### Step 3: 环境变量配置
```bash
# 复制模板
cp .env.production.example .env.production

# 编辑配置
nano .env.production
```

**必填项**:
```bash
NODE_ENV=production
JWT_SECRET="your_strong_secret_here"
WECHAT_APPID="your_appid"
WECHAT_APPSECRET="your_secret"
CORS_ORIGIN="https://yourdomain.com"
```

### Step 4: 构建和启动

#### 使用 PM2（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start npm --name "zijianfit-backend" -- run start:prod

# 查看状态
pm2 status

# 查看日志
pm2 logs zijianfit-backend

# 设置开机自启
pm2 startup
pm2 save
```

#### 使用 systemd
```bash
# 创建服务文件
sudo nano /etc/systemd/system/zijianfit-backend.service
```

内容：
```ini
[Unit]
Description=ZijianFit Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/zijianfit/backend
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=zijianfit-backend
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl start zijianfit-backend
sudo systemctl enable zijianfit-backend
```

---

## 🌐 Nginx 反向代理配置

### 安装 Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 配置示例
```nginx
# /etc/nginx/sites-available/zijianfit-backend
server {
    listen 80;
    server_name api.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL 证书
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/zijianfit-access.log;
    error_log /var/log/nginx/zijianfit-error.log;

    # 反向代理
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # 请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 缓存
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/zijianfit-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 SSL 证书配置

### 使用 Let's Encrypt（免费）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 监控和日志

### 日志管理
```bash
# 查看应用日志
pm2 logs zijianfit-backend

# 查看系统日志
tail -f /var/log/nginx/zijianfit-access.log
tail -f /var/log/nginx/zijianfit-error.log
```

### 性能监控
```bash
# PM2 监控
pm2 monit

# 系统资源
htop
```

### 告警配置
```bash
# 使用 PM2 Plus（可选）
pm2 link <secret_key> <public_key>
```

---

## 🔄 更新部署

### 标准更新流程
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
npm ci --production

# 3. 运行迁移
npx prisma migrate deploy

# 4. 重启服务
pm2 restart zijianfit-backend

# 5. 检查状态
pm2 logs zijianfit-backend --lines 100
```

### 零停机更新
```bash
# 使用 PM2 集群模式
pm2 start npm --name "zijianfit-backend" -i max -- run start:prod

# 平滑重启
pm2 reload zijianfit-backend
```

---

## 🐛 故障排查

### 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

#### 2. 数据库连接失败
```bash
# 检查数据库连接
npx prisma db push --preview-feature

# 查看错误日志
pm2 logs zijianfit-backend --err
```

#### 3. 内存不足
```bash
# 增加 Node.js 内存限制
pm2 start npm --name "zijianfit-backend" --node-args="--max-old-space-size=2048" -- run start:prod
```

#### 4. 微信登录失败
```bash
# 检查配置
echo $WECHAT_APPID
echo $WECHAT_APPSECRET

# 测试连接
curl https://api.weixin.qq.com/sns/jscode2session
```

---

## 📈 性能优化

### 1. 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_user_openid ON users(openid);
CREATE INDEX idx_plan_week ON plans(year, week_number);
```

### 2. 缓存配置（可选）
```bash
# 安装 Redis
sudo apt install redis-server

# 配置应用使用 Redis
# 在 .env.production 中添加
REDIS_URL=redis://localhost:6379
```

### 3. 负载均衡
```nginx
# Nginx 负载均衡
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

---

## 🔐 安全加固

### 1. 防火墙配置
```bash
# 只开放必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. 定期更新
```bash
# 更新系统
sudo apt update && sudo apt upgrade

# 更新依赖
npm update
```

### 3. 备份策略
```bash
# 数据库备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump zijianfit > backup_$DATE.sql
```

---

## ✅ 部署验证

### 健康检查
```bash
# 检查服务状态
curl http://localhost:3001/health

# 检查 API
curl https://api.yourdomain.com/
```

### 性能测试
```bash
# 使用 Apache Bench
ab -n 1000 -c 100 https://api.yourdomain.com/api/plans/current
```

---

## 📞 支持

**文档**: `docs/`  
**问题反馈**: GitHub Issues  
**技术支持**: 随行 AI 🦞

---

**部署完成！** 🎉
