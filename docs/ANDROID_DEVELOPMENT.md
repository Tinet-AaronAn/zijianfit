# 📱 Android 开发测试指南

**最后更新**: 2026-03-06
**测试环境**: Android 模拟器
**状态**: ✅ 测试通过

---

## ✅ 环境配置（已完成）

### 1. Gradle 代理配置
**文件**: `~/.gradle/gradle.properties`
```properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=7897
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=7897
```

### 2. Java 环境
- **版本**: OpenJDK 17.0.18
- **配置**: `~/.zshrc`
```bash
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

### 3. Android SDK
- **路径**: `/usr/local/share/android-commandlinetools`
- **组件**:
  - Platform Tools ✅
  - Build Tools 36.0.0 ✅
  - Platforms (android-35, android-36) ✅
  - NDK 26.1.10909125 ✅

### 4. 项目配置
- **Gradle**: 8.7
- **AGP**: 8.6.0
- **Kotlin**: 1.9.22
- **compileSdk**: 35
- **minSdk**: 24
- **targetSdk**: 34

---

## 🚀 运行测试

### 启动后端服务器

```bash
cd ~/.openclaw/workspace/projects/zijianfit/backend
npm run dev
```

**验证**:
```bash
curl http://localhost:3001/health
# 预期: {"status":"ok","env":"development"}
```

### 启动 Metro Bundler

```bash
cd ~/.openclaw/workspace/projects/zijianfit/mobile
npm start
```

### 启动 Android 模拟器

```bash
# 列出可用模拟器
emulator -list-avds

# 启动模拟器
emulator -avd test_device
```

### 运行应用

```bash
# 方式1: React Native CLI（推荐）
cd ~/.openclaw/workspace/projects/zijianfit/mobile
npm run android

# 方式2: 手动安装
# 1. 构建 APK
cd android && ./gradlew assembleDebug

# 2. 安装到模拟器
adb install app/build/outputs/apk/debug/app-debug.apk

# 3. 启动应用
adb shell am start -n com.zijianfit/.MainActivity
```

---

## 🧪 自动化测试

### 测试脚本

**位置**: `/tmp/test_login.sh`

```bash
#!/bin/bash
# ZijianFit 登录自动化测试

ADB="$ANDROID_HOME/platform-tools/adb"

# 输入用户名
$ADB shell input tap 540 900
$ADB shell input text "testuser"

# 输入密码
$ADB shell input tap 540 1100
$ADB shell input text "Test123456"

# 点击登录
$ADB shell input tap 540 1400

# 检查后端日志
tail -10 /tmp/backend.log | grep "POST /api/auth/login"
```

**运行**:
```bash
chmod +x /tmp/test_login.sh
/tmp/test_login.sh
```

### 测试账号

- **用户名**: `testuser`
- **密码**: `Test123456`

---

## 📊 测试检查清单

### 功能测试
- [x] 应用启动
- [x] 用户登录
- [x] 用户注册
- [x] 查看训练计划
- [x] 查看统计页面
- [ ] 开始训练（待测试）
- [ ] 视频播放（待测试）

### 网络测试
- [x] API 连接正常
- [x] 登录接口 200 OK
- [x] Token 存储正常
- [x] 后端响应时间 < 100ms

---

## 🔧 常见问题

### 问题1: Metro Bundler 连接失败

**解决方案**:
```bash
# 清理缓存
npm start -- --reset-cache

# 或重新安装依赖
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 问题2: Android 构建失败

**解决方案**:
```bash
# 清理构建缓存
cd android
./gradlew clean
cd ..

# 重新构建
npm run android
```

### 问题3: 网络请求失败

**检查**:
1. 后端服务器运行正常
2. API 地址配置正确（`http://10.0.2.2:3001/api`）
3. 模拟器网络正常

**测试网络**:
```bash
# 在模拟器中测试
adb shell "ping -c 3 10.0.2.2"
```

---

## 📝 已知问题与修复

### ✅ 已修复

| 问题 | 原因 | 解决方案 | 日期 |
|------|------|----------|------|
| hostname undefined | window.location 在 RN 中未定义 | 使用固定地址 10.0.2.2 | 2026-03-06 |
| zustand persist 错误 | AsyncStorage 配置错误 | 添加 createJSONStorage | 2026-03-06 |
| react-navigation 兼容性 | 7.x 与 screens 3.x 不兼容 | 降级到 6.x | 2026-03-06 |
| 数据库路径错误 | .env 使用相对路径 | 改为绝对路径 | 2026-03-06 |

---

## 🎯 性能指标

**当前表现**:
- 应用启动: < 3秒
- API 响应: 78-80ms
- Metro Bundle 时间: ~1秒
- APK 大小: 132MB

**目标**:
- 应用启动: < 2秒
- API 响应: < 100ms
- APK 大小: < 100MB（Release 构建）

---

## 📚 相关文档

- [环境配置详细说明](../../README.md)
- [后端 API 文档](../backend/README.md)
- [产品需求文档](../docs/prd/PRD.md)

---

**测试状态**: ✅ 基础功能测试通过
**下一步**: 真机测试、完整功能测试
