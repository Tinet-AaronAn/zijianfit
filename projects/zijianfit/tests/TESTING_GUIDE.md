# 自健身 App - 测试指南

**版本**: v1.0  
**最后更新**: 2026-03-01

---

## 目录

1. [测试环境搭建](#1-测试环境搭建)
2. [后端 API 测试](#2-后端-api-测试)
3. [单元测试](#3-单元测试)
4. [E2E 测试](#4-e2e-测试)
5. [Mock 数据使用](#5-mock-数据使用)
6. [最佳实践](#6-最佳实践)

---

## 1. 测试环境搭建

### 1.1 后端测试环境

#### 安装依赖

```bash
cd backend
npm install --save-dev jest supertest @types/jest ts-jest
```

#### Jest 配置

在 `backend/jest.config.js` 中添加：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

#### 环境变量

创建 `backend/.env.test`：

```env
NODE_ENV=test
DATABASE_URL="file:./test.db"
JWT_SECRET=test_jwt_secret_key
JWT_EXPIRES_IN=1h
WECHAT_APPID=test_appid
WECHAT_APPSECRET=test_appsecret
PORT=3002
```

#### 测试脚本

在 `backend/package.json` 中添加：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

### 1.2 前端测试环境

#### 安装 Detox（待前端完成后执行）

```bash
cd mobile
npm install --save-dev detox detox-cli
```

#### Detox 配置示例

在 `mobile/package.json` 中添加：

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
    }
  }
}
```

---

## 2. 后端 API 测试

### 2.1 编写测试用例

#### 基本结构

```typescript
import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, cleanupTestData } from '../helpers/testDb';

describe('模块名称', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    // 清理资源
  });

  describe('接口名称', () => {
    it('测试描述', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
```

#### 认证测试示例

```typescript
it('无 Token 应该返回 401', async () => {
  const response = await request(app).get('/api/auth/me');

  expect(response.status).toBe(401);
  expect(response.body.error.code).toBe('UNAUTHORIZED');
});
```

### 2.2 测试数据库

#### 使用辅助函数

```typescript
import {
  createTestUser,
  createFullTestPlan,
  cleanupTestData,
  generateTestToken,
} from '../helpers/testDb';

beforeEach(async () => {
  await cleanupTestData();
  testUser = await createTestUser();
  testToken = generateTestToken(testUser.id);
});
```

### 2.3 运行测试

```bash
# 运行所有测试
npm test

# 运行特定文件
npm test -- auth.test.ts

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

---

## 3. 单元测试

### 3.1 工具函数测试

```typescript
// tests/unit/utils/dateHelper.test.ts
import { getWeekNumber, formatDate } from '../../../src/utils/dateHelper';

describe('日期工具函数', () => {
  describe('getWeekNumber', () => {
    it('应该返回正确的周数', () => {
      const date = new Date('2026-03-02');
      expect(getWeekNumber(date)).toBe(10);
    });
  });

  describe('formatDate', () => {
    it('应该格式化日期', () => {
      const date = new Date('2026-03-02');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-03-02');
    });
  });
});
```

### 3.2 Store 测试

```typescript
// tests/unit/stores/authStore.test.ts
import { useAuthStore } from '../../../src/store/useAuthStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('应该设置用户信息', () => {
    const { setUser } = useAuthStore.getState();
    setUser({ id: '1', name: 'Test' });

    expect(useAuthStore.getState().user).toEqual({ id: '1', name: 'Test' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

---

## 4. E2E 测试

### 4.1 Detox 测试示例（待前端完成）

```typescript
// tests/e2e/login.test.ts
describe('登录流程', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('应该显示登录页', async () => {
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('应该完成微信登录', async () => {
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

### 4.2 训练流程测试

```typescript
// tests/e2e/workout.test.ts
describe('训练流程', () => {
  it('应该开始训练', async () => {
    await element(by.id('start-workout-button')).tap();
    await expect(element(by.id('exercise-screen'))).toBeVisible();
  });

  it('应该完成一组动作', async () => {
    await element(by.id('complete-set-button')).tap();
    await expect(element(by.id('rest-timer'))).toBeVisible();
  });
});
```

---

## 5. Mock 数据使用

### 5.1 API 响应 Mock

```typescript
import {
  mockAuthResponse,
  mockCurrentPlanResponse,
  mockErrorResponse,
} from '../tests/mocks/apiResponses';

// 在测试中使用
it('应该返回计划数据', async () => {
  // Mock axios
  jest.spyOn(axios, 'get').mockResolvedValue({ data: mockCurrentPlanResponse });

  const result = await fetchCurrentPlan();

  expect(result).toEqual(mockCurrentPlanResponse.data);
});
```

### 5.2 用户数据 Mock

```typescript
import { mockNewUser, mockExistingUser, generateMockUser } from '../tests/mocks/userData';

// 使用预定义用户
const user = mockExistingUser;

// 生成随机用户
const randomUser = generateMockUser();

// 批量生成
const users = Array.from({ length: 10 }, () => generateMockUser());
```

### 5.3 训练数据 Mock

```typescript
import {
  mockFullPlan,
  mockTrainingDayExercises,
  generateFullWeekPlan,
} from '../tests/mocks/workoutData';

// 使用预定义数据
const exercises = mockTrainingDayExercises;

// 生成完整周计划
const { dayPlans, exercises } = generateFullWeekPlan('plan-001');
```

---

## 6. 最佳实践

### 6.1 测试命名

```typescript
// ✅ 好的命名
it('TC-AUTH-001: 新用户首次登录应该创建用户记录', async () => {});

// ❌ 不好的命名
it('test login', async () => {});
```

### 6.2 测试隔离

```typescript
// ✅ 每个测试前清理数据
beforeEach(async () => {
  await cleanupTestData();
});

// ❌ 依赖其他测试的状态
it('test1', async () => {
  globalTestData = 'xxx';
});

it('test2', async () => {
  console.log(globalTestData); // 不推荐
});
```

### 6.3 断言完整

```typescript
// ✅ 完整断言
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.data).toHaveProperty('id');
expect(response.body.data.name).toBe('Test');

// ❌ 不完整断言
expect(response).toBeDefined();
```

### 6.4 异步处理

```typescript
// ✅ 使用 async/await
it('应该返回数据', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// ❌ 不处理异步
it('应该返回数据', () => {
  fetchData().then(result => {
    expect(result).toBeDefined(); // 可能不执行
  });
});
```

### 6.5 错误处理

```typescript
// ✅ 测试错误情况
it('应该处理网络错误', async () => {
  jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

  await expect(fetchData()).rejects.toThrow('Network Error');
});
```

---

## 附录

### A. 测试命令速查

| 命令 | 说明 |
|------|------|
| `npm test` | 运行所有测试 |
| `npm test -- file.test.ts` | 运行指定文件 |
| `npm run test:watch` | 监听模式 |
| `npm run test:coverage` | 覆盖率报告 |
| `npm test -- --updateSnapshot` | 更新快照 |

### B. Jest 常用匹配器

| 匹配器 | 说明 |
|--------|------|
| `toBe(value)` | 严格相等 |
| `toEqual(value)` | 深度相等 |
| `toContain(item)` | 包含 |
| `toHaveProperty(path)` | 有属性 |
| `toBeNull()` | 为 null |
| `toBeUndefined()` | 为 undefined |
| `toBeTruthy()` | 为真 |
| `toBeFalsy()` | 为假 |
| `resolves` | Promise 成功 |
| `rejects` | Promise 失败 |

### C. 参考资源

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [Supertest 文档](https://github.com/visionmedia/supertest)
- [Detox 文档](https://wix.github.io/Detox/)
- [Testing Library](https://testing-library.com/)

---

**编写人**: 陆测  
**最后更新**: 2026-03-01
