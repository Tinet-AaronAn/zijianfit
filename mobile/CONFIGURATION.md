# 📱 移动端配置指南

**最后更新**: 2026-03-09

---

## 🎯 快速回答

### Q1: 如何设置 backend 服务地址？
**A**: 在 `mobile/src/constants/index.ts` 中修改 `apiConfig.baseURL`

### Q2: 设置后是否需要重新编译 APK？
**A**: **需要**。API 地址是编译时写入的，修改后必须重新编译。

### Q3: 是否需要域名和 SSL 证书？
**A**: 
- **开发环境**：不需要，使用 `http://10.0.2.2:3001` 即可
- **生产环境**：**强烈推荐**使用域名 + HTTPS（安全、稳定）

---

## 📝 详细配置说明

### 方案一：直接修改代码（简单）

#### 1. 找到配置文件

```typescript
// mobile/src/constants/index.ts

export const apiConfig = {
  baseURL: 'http://10.0.2.2:3001/api',  // ← 修改这里
  timeout: 10000,
};
```

#### 2. 修改 API 地址

根据你的场景选择：

**场景 A：Android 模拟器开发**
```typescript
baseURL: 'http://10.0.2.2:3001/api'
```

**场景 B：iOS 模拟器开发**
```typescript
baseURL: 'http://localhost:3001/api'
```

**场景 C：真机测试（局域网）**
```typescript
// 使用电脑的局域网 IP
baseURL: 'http://192.168.1.100:3001/api'
```

**场景 D：生产环境（域名 + HTTPS）**
```typescript
baseURL: 'https://api.yourdomain.com/api'
```

#### 3. 重新编译

```bash
cd mobile

# 开发版（测试）
npm run android

# 生产版（APK）
cd android && ./gradlew assembleRelease
```

---

### 方案二：使用环境变量（推荐）

#### 1. 安装依赖

```bash
cd mobile
npm install react-native-config
```

#### 2. 创建环境文件

**开发环境** `.env.development`:
```
API_URL=http://10.0.2.2:3001/api
```

**生产环境** `.env.production`:
```
API_URL=https://api.yourdomain.com/api
```

#### 3. 修改配置

```typescript
// mobile/src/constants/index.ts
import Config from 'react-native-config';

export const apiConfig = {
  baseURL: Config.API_URL || 'http://10.0.2.2:3001/api',
  timeout: 10000,
};
```

#### 4. 配置打包脚本

**package.json**:
```json
{
  "scripts": {
    "android:dev": "ENVFILE=.env.development npx react-native run-android",
    "android:prod": "ENVFILE=.env.production npx react-native run-android",
    "build:dev": "ENVFILE=.env.development cd android && ./gradlew assembleRelease",
    "build:prod": "ENVFILE=.env.production cd android && ./gradlew assembleRelease"
  }
}
```

#### 5. 使用不同环境

```bash
# 开发环境
npm run android:dev

# 生产环境
npm run android:prod
```

---

## 🌐 域名和 SSL 证书配置

### 开发环境（不需要域名和 SSL）

**Android 模拟器**：
- 使用特殊 IP：`10.0.2.2`
- 访问宿主机的 `localhost`
- HTTP 即可，无需 HTTPS

**真机测试（局域网）**：
- 使用电脑局域网 IP：`192.168.1.xxx`
- 确保手机和电脑在同一 Wi-Fi
- HTTP 即可，无需 HTTPS

**注意事项**：
1. 关闭电脑防火墙
2. 确保后端服务监听 `0.0.0.0` 而不是 `127.0.0.1`
3. 检查路由器是否开启了 AP 隔离

---

### 生产环境（强烈推荐域名 + SSL）

#### 为什么需要域名和 SSL？

1. **安全性**：
   - HTTPS 加密传输数据
   - 防止中间人攻击
   - 保护用户隐私（密码、Token）

2. **Android 限制**：
   - Android 9+ 默认禁止 HTTP 明文传输
   - 需要配置 `android:usesCleartextTraffic="true"`（不推荐）

3. **稳定性**：
   - 域名比 IP 更稳定
   - IP 可能变化，域名可以随时解析到新 IP

4. **专业性**：
   - 提升用户信任度
   - 符合应用商店要求

---

#### 配置步骤

##### 1. 购买域名

推荐域名注册商：
- 阿里云（万网）
- 腾讯云
- GoDaddy
- Namecheap

示例：`yourdomain.com`

---

##### 2. 配置 DNS 解析

添加 A 记录：
```
类型: A
主机记录: api
记录值: 你的服务器 IP
TTL: 600
```

结果：`api.yourdomain.com` → `123.45.67.89`

---

##### 3. 申请 SSL 证书

**方案 A：免费证书（Let's Encrypt）**

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

**方案 B：付费证书（更稳定）**
- 阿里云 SSL 证书
- 腾讯云 SSL 证书
- DigiCert
- Comodo

---

##### 4. 配置 Nginx

```nginx
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
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 反向代理到后端
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

---

##### 5. 更新移动端配置

```typescript
// mobile/src/constants/index.ts

export const apiConfig = {
  baseURL: 'https://api.yourdomain.com/api',  // ← 使用 HTTPS
  timeout: 10000,
};
```

---

##### 6. 重新编译 APK

```bash
cd mobile/android
./gradlew assembleRelease
```

生成的 APK 在：
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔄 不同环境切换

### 开发流程

```bash
# 1. 本地开发（模拟器）
修改 baseURL = 'http://10.0.2.2:3001/api'
npm run android

# 2. 真机测试（局域网）
修改 baseURL = 'http://192.168.1.100:3001/api'
npm run android

# 3. 生产发布（域名 + HTTPS）
修改 baseURL = 'https://api.yourdomain.com/api'
./gradlew assembleRelease
```

---

## 📋 配置检查清单

### 开发环境

- [ ] 后端服务运行在 `localhost:3001`
- [ ] Android 模拟器使用 `10.0.2.2`
- [ ] iOS 模拟器使用 `localhost`
- [ ] 可以访问 `http://xxx:3001/health`

### 真机测试

- [ ] 手机和电脑在同一 Wi-Fi
- [ ] 电脑防火墙已关闭
- [ ] 后端监听 `0.0.0.0:3001`
- [ ] 使用电脑局域网 IP
- [ ] 可以访问 `http://192.168.x.x:3001/health`

### 生产环境

- [ ] 已购买域名
- [ ] DNS 解析配置正确
- [ ] SSL 证书已申请并配置
- [ ] Nginx 反向代理配置正确
- [ ] 可以访问 `https://api.yourdomain.com/health`
- [ ] APK 使用 HTTPS 地址
- [ ] 重新编译并测试

---

## ⚠️ 常见问题

### Q1: 真机无法连接到后端？

**检查清单**：
1. 手机和电脑在同一 Wi-Fi
2. 电脑防火墙已关闭
3. 后端监听 `0.0.0.0` 而不是 `127.0.0.1`
4. 使用正确的局域网 IP
5. 路由器未开启 AP 隔离

**验证方法**：
```bash
# 在手机浏览器访问
http://192.168.1.100:3001/health
```

---

### Q2: Android 9+ 无法访问 HTTP？

**错误**：`CLEARTEXT communication not permitted`

**解决方案 1（推荐）**：使用 HTTPS

**解决方案 2（临时）**：允许明文传输
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:usesCleartextTraffic="true"
    ...>
```

---

### Q3: SSL 证书错误？

**原因**：
1. 证书过期
2. 域名不匹配
3. 证书链不完整

**解决方法**：
```bash
# 检查证书
openssl s_client -connect api.yourdomain.com:443

# 测试 HTTPS
curl -v https://api.yourdomain.com/health
```

---

### Q4: 修改后是否需要重新编译？

**是的，必须重新编译**。

原因：
- React Native 是编译时打包
- API 地址会写入 JS Bundle
- 修改任何代码都需要重新编译

**开发环境**：`npm run android`（1-2 分钟）  
**生产环境**：`./gradlew assembleRelease`（3-5 分钟）

---

## 🚀 最佳实践

### 1. 使用环境变量

```typescript
// 根据环境自动切换
const API_URLS = {
  development: 'http://10.0.2.2:3001/api',
  staging: 'http://192.168.1.100:3001/api',
  production: 'https://api.yourdomain.com/api',
};

export const apiConfig = {
  baseURL: API_URLS[process.env.NODE_ENV] || API_URLS.development,
  timeout: 10000,
};
```

---

### 2. 配置文件分离

```
mobile/
├── .env.development    # 开发环境
├── .env.staging        # 测试环境
├── .env.production     # 生产环境
└── src/
    └── constants/
        └── index.ts    # 读取环境变量
```

---

### 3. 健康检查

```typescript
// 启动时检查后端连接
const checkBackend = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ Backend connected:', response);
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
  }
};
```

---

## 📚 相关文档

- [快速开始指南](../QUICKSTART.md)
- [后端 README](../backend/README.md)
- [Docker Compose 配置](../backend/docker-compose.yml)
- [Nginx 配置示例](https://nginx.org/en/docs/)

---

**文档版本**: v1.0  
**最后更新**: 2026-03-09  
**维护者**: 随行 🦞
