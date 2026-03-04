# Android 真机测试指南

**配置时间**: 2026-03-04 12:15
**测试IP**: 172.16.21.187
**端口**: 3001

---

## 📋 测试前准备

### 1. 后端配置

**修改后端端口**:
```bash
cd ~/.openclaw/workspace/projects/zijianfit/backend
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development
JWT_SECRET=zijianfit_secret_key_2026
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=*
EOF
```

**启动后端服务**:
```bash
cd ~/.openclaw/workspace/projects/zijianfit/backend

# 1. 安装依赖（如果还没有）
pnpm install

# 2. 初始化数据库
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed

# 3. 启动服务
pnpm dev
```

**验证后端**:
```bash
# 测试健康检查
curl http://172.16.21.187:3001/health

# 预期输出
{"status":"ok","timestamp":"2026-03-04T...","env":"development"}
```

---

### 2. 前端配置

**API地址已配置为**: `http://172.16.21.187:3001/api` ✅

**位置**: `mobile/src/constants/index.ts`
```typescript
export const apiConfig = {
  baseURL: 'http://172.16.21.187:3001/api',
  timeout: 10000,
};
```

---

### 3. 手机与电脑连接

**确保**:
- ✅ 手机和电脑在**同一局域网**（连接同一个WiFi）
- ✅ 电脑IP地址: 172.16.21.187
- ✅ 电脑防火墙允许 3001 端口访问

**验证连接**:
在手机浏览器访问: `http://172.16.21.187:3001/health`
应该看到: `{"status":"ok",...}`

---

## 🚀 运行前端应用

### 方式1: 使用 Expo（推荐）

```bash
cd ~/.openclaw/workspace/projects/zijianfit/mobile

# 1. 安装依赖
pnpm install

# 2. 启动 Expo
npx expo start

# 3. 在手机上安装 Expo Go
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent

# 4. 扫描二维码
```

### 方式2: 使用 React Native CLI

```bash
cd ~/.openclaw/workspace/projects/zijianfit/mobile

# 1. 安装依赖
pnpm install

# 2. 运行 Android 应用
npx react-native run-android

# 需要:
# - Android Studio 已安装
# - Android SDK 已配置
# - 手机已开启 USB 调试
```

---

## ✅ 测试步骤

### 1. 启动后端
```bash
cd ~/.openclaw/workspace/projects/zijianfit/backend
pnpm dev
```

**预期输出**:
```
Server running on http://0.0.0.0:3001
Database connected
Prisma client initialized
```

### 2. 启动前端
```bash
# 新终端窗口
cd ~/.openclaw/workspace/projects/zijianfit/mobile
npx expo start
```

### 3. 在手机上测试

**测试账号**:
- 用户名: `testuser`
- 密码: `Test123456`

**测试流程**:
1. ✅ 打开 App，看到登录页
2. ✅ 点击"立即注册"，填写注册信息
3. ✅ 注册成功，自动登录
4. ✅ 进入首页，看到今日训练计划
5. ✅ 点击训练计划，查看详情
6. ✅ 点击"开始训练"，进入训练页面
7. ✅ 完成训练，查看统计页

---

## 🔍 常见问题排查

### 问题1: 无法连接到后端

**检查**:
```bash
# 1. 确认后端运行中
ps aux | grep "node.*zijianfit"

# 2. 确认端口监听
lsof -i :3001

# 3. 确认防火墙
# macOS: 系统偏好设置 → 安全性与隐私 → 防火墙
```

**解决**:
- 后端监听 0.0.0.0 而非 127.0.0.1
- 检查 .env 中的 CORS_ORIGIN=*

### 问题2: Expo 无法连接

**检查**:
```bash
# 确认 Expo 运行
ps aux | grep expo

# 确认手机和电脑在同一 WiFi
# 在手机浏览器访问 Expo 显示的 URL
```

### 问题3: 登录失败

**检查**:
```bash
# 查看后端日志
tail -f ~/.openclaw/workspace/projects/zijianfit/backend/logs/combined.log

# 手动测试 API
curl -X POST http://172.16.21.187:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123456"}'
```

---

## 📊 测试检查清单

### 功能测试
- [ ] 用户注册
- [ ] 用户登录
- [ ] 查看训练计划
- [ ] 查看训练详情
- [ ] 开始训练（倒计时）
- [ ] 完成训练
- [ ] 查看统计
- [ ] 退出登录

### 界面测试
- [ ] 登录页显示正常
- [ ] 注册页密码强度提示
- [ ] 首页今日训练卡片
- [ ] 训练详情动作列表
- [ ] 训练页面视频播放
- [ ] 统计页图表显示

### 网络测试
- [ ] API 请求正常
- [ ] Token 存储正常
- [ ] 自动刷新 Token
- [ ] 错误提示友好

---

## 🎯 性能指标

**目标**:
- 页面加载 < 1秒
- API 响应 < 200ms
- 视频加载 < 3秒
- 内存占用 < 100MB

---

## 📝 测试记录

**测试时间**: ________________
**测试人员**: ________________
**手机型号**: ________________
**Android版本**: ________________

**发现问题**:
1. ________________
2. ________________
3. ________________

---

**祝测试顺利！** 🦞
