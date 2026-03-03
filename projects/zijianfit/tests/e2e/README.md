# E2E 测试

**状态**: 待前端项目完成后配置

---

## 技术选型

- **框架**: Detox
- **平台**: Android (iOS 可选)

---

## 配置步骤（待执行）

### 1. 安装 Detox

```bash
cd mobile
npm install --save-dev detox detox-cli
npm install --save-dev jest
```

### 2. 初始化 Detox

```bash
npx detox init
```

### 3. 配置 package.json

```json
{
  "detox": {
    "configurations": {
      "android.emu.debug": {
        "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
        "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
        "type": "android.emulator",
        "device": {
          "avdName": "Pixel_4_API_28"
        }
      }
    },
    "test-runner": "jest"
  }
}
```

### 4. 创建测试文件

```
e2e/
├── login.test.ts           # 登录流程
├── workout.test.ts         # 训练流程
├── stats.test.ts           # 统计页
└── settings.test.ts        # 设置页
```

---

## 测试用例示例

### 登录流程

```typescript
describe('登录流程', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('TC-E2E-001: 应该显示登录页', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('wechat-login-button'))).toBeVisible();
  });

  it('TC-E2E-002: 点击微信登录', async () => {
    await element(by.id('wechat-login-button')).tap();
    // 需要 Mock 微信 SDK
  });
});
```

### 训练流程

```typescript
describe('训练流程', () => {
  beforeEach(async () => {
    // 假设已登录
    await device.launchApp({ newInstance: true });
  });

  it('TC-E2E-003: 应该显示本周计划', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('plan-card-1'))).toBeVisible();
  });

  it('TC-E2E-004: 点击开始训练', async () => {
    await element(by.id('day-card-1')).tap();
    await element(by.id('start-workout-button')).tap();
    await expect(element(by.id('exercise-screen'))).toBeVisible();
  });

  it('TC-E2E-005: 完成一组动作', async () => {
    await element(by.id('complete-set-button')).tap();
    await expect(element(by.id('rest-timer'))).toBeVisible();
  });
});
```

---

## 元素 ID 约定

前端开发时需要为可测试元素添加 `testID`：

```tsx
// 示例
<TouchableOpacity testID="wechat-login-button" onPress={handleLogin}>
  <Text>微信登录</Text>
</TouchableOpacity>

<View testID="home-screen">
  <PlanCard testID="plan-card-1" />
</View>
```

---

## 运行 E2E 测试

```bash
# 构建
npx detox build -c android.emu.debug

# 运行
npx detox test -c android.emu.debug

# 运行指定文件
npx detox test -c android.emu.debug e2e/login.test.ts
```

---

## 注意事项

1. **模拟器**: 需要预先创建 Android 模拟器
2. **构建**: E2E 测试需要完整的 Debug APK
3. **时间**: E2E 测试较慢，建议只在 CI 或重要验证时运行
4. **稳定性**: 使用明确的 `testID`，避免依赖文本内容

---

**待补充**: 前端完成后实现完整测试用例
