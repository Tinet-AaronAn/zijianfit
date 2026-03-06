# ZijianFit Mobile App

自健身移动应用 - React Native 实现

## 📱 项目信息

- **框架**: React Native 0.74.7
- **语言**: TypeScript
- **导航**: React Navigation 6.x
- **状态管理**: Zustand
- **UI 组件**: React Native Paper

## 🚀 快速开始

### 前置要求

- Node.js 18+
- React Native CLI
- Android Studio (Android 开发)
- Xcode 14+ (iOS 开发，仅 macOS)

### 安装依赖

```bash
npm install --legacy-peer-deps
# 或
pnpm install
```

### 运行应用

#### Android

```bash
# 启动 Metro Bundler
npm start

# 新终端 - 运行 Android 应用
npm run android
```

#### iOS (仅 macOS)

```bash
# 安装 iOS 依赖
cd ios && pod install && cd ..

# 启动 Metro Bundler
npm start

# 新终端 - 运行 iOS 应用
npm run ios
```

## 🧪 测试

### 测试账号

- **用户名**: testuser
- **密码**: Test123456

### Android 模拟器测试

1. 启动 Android 模拟器
2. 运行 `npm run android`
3. 应用自动安装并启动

## 📂 项目结构

```
mobile/
├── src/
│   ├── constants/      # 常量配置（颜色、字体、API）
│   ├── screens/        # 页面组件
│   ├── navigation/     # 导航配置
│   ├── stores/         # Zustand 状态管理
│   ├── services/       # API 服务
│   ├── components/     # 通用组件
│   └── types/          # TypeScript 类型定义
├── App.tsx             # 应用入口
└── index.js            # React Native 入口
```

## ⚙️ 配置

### API 地址配置

编辑 `src/constants/index.ts`:

```typescript
export const apiConfig = {
  // Android 模拟器访问宿主机
  baseURL: 'http://10.0.2.2:3001/api',
  
  // iOS 模拟器访问本机
  // baseURL: 'http://localhost:3001/api',
  
  // 真机访问（局域网IP）
  // baseURL: 'http://192.168.1.100:3001/api',
  
  timeout: 10000,
};
```

### Android SDK 版本

- **compileSdkVersion**: 35
- **buildToolsVersion**: 34.0.0
- **minSdkVersion**: 24
- **targetSdkVersion**: 34
- **NDK**: 26.1.10909125

## 🐛 故障排查

### Metro Bundler 启动失败

```bash
# 清理缓存
npm start -- --reset-cache
```

### Android 构建失败

```bash
# 清理 Android 构建缓存
cd android
./gradlew clean
cd ..

# 重新运行
npm run android
```

### 网络连接失败

1. 确认后端服务器运行在 `http://localhost:3001`
2. 确认 API 地址配置正确
3. 模拟器使用 `10.0.2.2` 访问宿主机

## 📝 开发注意事项

### 依赖兼容性

- **react-navigation**: 使用 6.x（兼容 react-native-screens 3.x）
- **async-storage**: 使用 2.x（避免 Kotlin 兼容问题）
- 使用 `--legacy-peer-deps` 解决依赖冲突

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件命名使用 PascalCase
- 函数命名使用 camelCase

## 📚 相关文档

- [React Native 文档](https://reactnative.dev/docs/getting-started)
- [React Navigation 文档](https://reactnavigation.org/docs/getting-started)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

**最后更新**: 2026-03-06
**维护者**: 安老师 + 随行 AI 🦞
