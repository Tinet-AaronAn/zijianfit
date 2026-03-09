# 📘 ZijianFit API 使用示例

**版本**: v1.0  
**最后更新**: 2026-03-09  
**基础 URL**: `http://localhost:3001/api`

---

## 📋 API 概览

| 模块 | 端点 | 方法 | 认证 | 说明 |
|------|------|------|------|------|
| 认证 | /auth/register | POST | ❌ | 用户注册 |
| | /auth/login | POST | ❌ | 用户登录 |
| | /auth/me | GET | ✅ | 获取当前用户 |
| | /auth/refresh | POST | ✅ | 刷新 Token |
| 计划 | /plans/current | GET | ❌ | 获取当前计划 |
| | /plans/my | GET | ✅ | 获取我的计划 |
| | /plans/:id | GET | ❌ | 获取计划详情 |
| | /plans/:id/days/:day | GET | ❌ | 获取某日训练 |

---

## 1. 认证 API

### 1.1 用户注册

#### 请求
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456",
  "confirmPassword": "Test123456",
  "nickname": "测试用户"
}
```

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc123",
      "username": "testuser",
      "nickname": "测试用户",
      "createdAt": "2026-03-09T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

#### 错误响应（400）
```json
{
  "success": false,
  "error": {
    "code": "USERNAME_EXISTS",
    "message": "用户名已被使用，请换一个"
  }
}
```

#### 错误码
| 错误码 | 说明 |
|--------|------|
| USERNAME_EXISTS | 用户名已存在 |
| USERNAME_INVALID | 用户名格式不正确 |
| PASSWORD_INVALID | 密码格式不正确 |
| PASSWORD_MISMATCH | 两次密码不一致 |

#### 示例代码
```typescript
// React Native / TypeScript
import axios from 'axios';

const register = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/register', {
      username,
      password,
      confirmPassword: password,
      nickname: username,
    });

    const { user, token } = response.data.data;
    
    // 保存 Token
    await AsyncStorage.setItem('token', token);
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.error?.message || '注册失败';
    return { success: false, message };
  }
};

// 使用
const result = await register('testuser', 'Test123456');
if (result.success) {
  console.log('注册成功', result.user);
} else {
  console.error('注册失败', result.message);
}
```

---

### 1.2 用户登录

#### 请求
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456"
}
```

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc123",
      "username": "testuser",
      "nickname": "测试用户"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

#### 错误响应（401）
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在"
  }
}
```

#### 示例代码
```typescript
const login = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', {
      username,
      password,
    });

    const { user, token } = response.data.data;
    
    // 保存 Token
    await AsyncStorage.setItem('token', token);
    
    // 设置全局认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.error?.message || '登录失败';
    return { success: false, message };
  }
};
```

---

### 1.3 获取当前用户

#### 请求
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "username": "testuser",
    "nickname": "测试用户",
    "createdAt": "2026-03-09T10:00:00Z"
  }
}
```

#### 错误响应（401）
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token 无效"
  }
}
```

#### 示例代码
```typescript
const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await axios.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token 过期，尝试刷新
      await refreshToken();
      // 重试获取用户信息
      return getCurrentUser();
    }
    throw error;
  }
};
```

---

### 1.4 刷新 Token

#### 请求
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

#### 示例代码
```typescript
const refreshToken = async () => {
  try {
    const oldToken = await AsyncStorage.getItem('token');
    
    const response = await axios.post('/api/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${oldToken}`,
      },
    });

    const newToken = response.data.data.token;
    
    // 保存新 Token
    await AsyncStorage.setItem('token', newToken);
    
    // 更新全局认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    return newToken;
  } catch (error) {
    // Token 刷新失败，退出登录
    await logout();
    throw error;
  }
};
```

---

## 2. 训练计划 API

### 2.1 获取当前计划

#### 请求
```http
GET /api/plans/current
```

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "id": "plan-uuid",
    "name": "45岁健身计划",
    "weekNumber": 10,
    "year": 2026,
    "days": [
      {
        "id": "day-1",
        "planId": "plan-uuid",
        "dayOfWeek": 1,
        "dayName": "周一",
        "isRestDay": false,
        "title": "上肢力量",
        "description": "哑铃训练",
        "totalDuration": 20,
        "exerciseCount": 5
      },
      {
        "id": "day-2",
        "planId": "plan-uuid",
        "dayOfWeek": 2,
        "dayName": "周二",
        "isRestDay": false,
        "title": "上肢力量 + 慢跑",
        "description": "力量训练 + 有氧",
        "totalDuration": 50,
        "exerciseCount": 8
      },
      {
        "id": "day-3",
        "planId": "plan-uuid",
        "dayOfWeek": 3,
        "dayName": "周三",
        "isRestDay": true,
        "title": "休息",
        "description": "好好放松",
        "totalDuration": 0,
        "exerciseCount": 0
      }
      // ... 7天
    ]
  }
}
```

#### 示例代码
```typescript
const getCurrentPlan = async () => {
  try {
    const response = await axios.get('/api/plans/current');
    return response.data.data;
  } catch (error) {
    console.error('获取计划失败', error);
    throw error;
  }
};

// 使用
const plan = await getCurrentPlan();
console.log(`本周是第 ${plan.weekNumber} 周`);
console.log(`共有 ${plan.days.length} 天的训练`);
```

---

### 2.2 获取某日训练详情

#### 请求
```http
GET /api/plans/:planId/days/:dayOfWeek
```

**参数说明**：
- `planId`: 计划 ID（从 `/plans/current` 获取）
- `dayOfWeek`: 星期几（1-7，1=周一，7=周日）

#### 成功响应（200）
```json
{
  "success": true,
  "data": {
    "id": "day-1",
    "planId": "plan-uuid",
    "dayOfWeek": 1,
    "dayName": "周一",
    "isRestDay": false,
    "title": "上肢力量",
    "description": "哑铃训练",
    "totalDuration": 20,
    "exercises": [
      {
        "id": "ex-1",
        "name": "哑铃对握卧推",
        "type": "strength",
        "sets": 3,
        "reps": 15,
        "duration": 0,
        "restSeconds": 60,
        "videoUrl": "https://www.bilibili.com/video/BV1abc123",
        "videoSource": "bilibili",
        "muscleGroup": "胸部",
        "order": 1
      },
      {
        "id": "ex-2",
        "name": "哑铃俯身划船",
        "type": "strength",
        "sets": 3,
        "reps": 15,
        "duration": 0,
        "restSeconds": 60,
        "videoUrl": "https://www.bilibili.com/video/BV1def456",
        "videoSource": "bilibili",
        "muscleGroup": "背部",
        "order": 2
      }
      // ... 更多动作
    ]
  }
}
```

#### 休息日响应（200）
```json
{
  "success": true,
  "data": {
    "id": "day-3",
    "planId": "plan-uuid",
    "dayOfWeek": 3,
    "dayName": "周三",
    "isRestDay": true,
    "title": "休息",
    "description": "今天是休息日，好好放松",
    "totalDuration": 0,
    "exercises": []
  }
}
```

#### 错误响应（404）
```json
{
  "success": false,
  "error": {
    "code": "PLAN_NOT_FOUND",
    "message": "计划不存在"
  }
}
```

#### 示例代码
```typescript
const getDayPlan = async (planId: string, dayOfWeek: number) => {
  try {
    const response = await axios.get(`/api/plans/${planId}/days/${dayOfWeek}`);
    const dayPlan = response.data.data;

    if (dayPlan.isRestDay) {
      console.log('今天是休息日');
      return null;
    }

    console.log(`今日训练：${dayPlan.title}`);
    console.log(`共 ${dayPlan.exercises.length} 个动作`);
    console.log(`预计用时 ${dayPlan.totalDuration} 分钟`);

    return dayPlan;
  } catch (error) {
    console.error('获取训练详情失败', error);
    throw error;
  }
};

// 使用
const dayPlan = await getDayPlan('plan-uuid', 1);
if (dayPlan) {
  dayPlan.exercises.forEach(exercise => {
    console.log(`${exercise.name}: ${exercise.sets}组×${exercise.reps}次`);
  });
}
```

---

## 3. 完整示例：训练流程

### 3.1 登录并获取今日训练

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 配置 API 基础 URL
const api = axios.create({
  baseURL: 'http://10.0.2.2:3001/api',
  timeout: 10000,
});

// 请求拦截器：添加 Token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，退出登录
      await AsyncStorage.removeItem('token');
      // 跳转到登录页
    }
    return Promise.reject(error);
  }
);

// 完整训练流程
async function startWorkout() {
  try {
    // 1. 登录
    console.log('🔐 登录中...');
    const loginRes = await api.post('/auth/login', {
      username: 'testuser',
      password: 'Test123456',
    });
    const token = loginRes.data.data.token;
    await AsyncStorage.setItem('token', token);
    console.log('✅ 登录成功');

    // 2. 获取当前计划
    console.log('📋 获取训练计划...');
    const planRes = await api.get('/plans/current');
    const plan = planRes.data.data;
    console.log(`📅 本周是第 ${plan.weekNumber} 周`);

    // 3. 获取今日训练（假设今天是周一）
    const today = 1; // 周一
    const dayRes = await api.get(`/api/plans/${plan.id}/days/${today}`);
    const dayPlan = dayRes.data.data;

    if (dayPlan.isRestDay) {
      console.log('💤 今天是休息日');
      return;
    }

    console.log(`💪 今日训练：${dayPlan.title}`);
    console.log(`⏱ 预计用时：${dayPlan.totalDuration} 分钟`);
    console.log(`📊 共 ${dayPlan.exercises.length} 个动作：`);

    dayPlan.exercises.forEach((exercise, index) => {
      console.log(
        `  ${index + 1}. ${exercise.name} - ${exercise.sets}组×${exercise.reps}次`
      );
    });

    // 4. 开始训练
    console.log('\n🔥 开始训练！');
    for (const exercise of dayPlan.exercises) {
      console.log(`\n💪 ${exercise.name}`);
      console.log(`   组数：${exercise.sets}组`);
      console.log(`   次数：${exercise.reps}次`);
      console.log(`   休息：${exercise.restSeconds}秒`);
      console.log(`   视频：${exercise.videoUrl}`);

      // 模拟训练
      for (let set = 1; set <= exercise.sets; set++) {
        console.log(`   第 ${set}/${exercise.sets} 组`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟训练
        console.log(`   ✅ 完成`);
        if (set < exercise.sets) {
          console.log(`   💤 休息 ${exercise.restSeconds} 秒`);
          await new Promise((resolve) => 
            setTimeout(resolve, exercise.restSeconds * 100)
          );
        }
      }
    }

    console.log('\n🎉 训练完成！');
  } catch (error) {
    console.error('❌ 错误', error.message);
  }
}

// 执行
startWorkout();
```

---

## 4. 错误处理最佳实践

### 4.1 统一错误处理

```typescript
// utils/apiError.ts
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// 使用
const handleApiCall = async (apiCall: () => Promise<any>) => {
  try {
    const response = await apiCall();
    return { success: true, data: response.data };
  } catch (error) {
    const apiError = new ApiError(
      error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      error.response?.data?.error?.message || '网络错误',
      error.response?.status || 500
    );
    return { success: false, error: apiError };
  }
};

// 示例
const result = await handleApiCall(() => api.get('/plans/current'));
if (result.success) {
  console.log('计划数据', result.data);
} else {
  console.error('错误', result.error.message);
}
```

---

### 4.2 重试机制

```typescript
const retryApiCall = async (
  apiCall: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log(`重试第 ${i + 1} 次...`);
      }
    }
  }

  throw lastError;
};

// 使用
const plan = await retryApiCall(() => api.get('/plans/current'));
```

---

## 5. 使用 Postman 测试

### 5.1 环境变量
```
BASE_URL=http://localhost:3001/api
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5.2 请求示例

#### 注册
```
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456",
  "confirmPassword": "Test123456"
}
```

#### 登录
```
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456"
}
```

#### 获取计划
```
GET {{BASE_URL}}/plans/current
```

#### 获取今日训练
```
GET {{BASE_URL}}/plans/{{planId}}/days/1
Authorization: Bearer {{TOKEN}}
```

---

## 6. 常见问题

### Q1: 401 Unauthorized 错误？
**A**: 检查 Token 是否有效：
1. 确认 Token 格式：`Bearer <token>`
2. 确认 Token 未过期（7天有效期）
3. 尝试刷新 Token

---

### Q2: CORS 错误？
**A**: 后端已配置 CORS，允许所有来源。如果仍有问题：
1. 检查请求 URL 是否正确
2. 确认后端服务已启动
3. 检查网络连接

---

### Q3: 请求超时？
**A**: 默认超时 10 秒，可以调整：
```typescript
const api = axios.create({
  baseURL: 'http://10.0.2.2:3001/api',
  timeout: 30000, // 30秒
});
```

---

## 7. 性能优化建议

### 7.1 使用缓存
```typescript
// 简单缓存实现
const cache = new Map();

const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetcher();
  cache.set(key, data);

  // 1小时后过期
  setTimeout(() => cache.delete(key), 60 * 60 * 1000);

  return data;
};

// 使用
const plan = await getCachedData('current-plan', () => 
  api.get('/plans/current')
);
```

---

### 7.2 并发请求
```typescript
// 并发获取多天训练
const days = [1, 2, 3, 4, 5, 6, 7];
const promises = days.map((day) =>
  api.get(`/plans/${planId}/days/${day}`)
);

const results = await Promise.all(promises);
const weekPlan = results.map((res) => res.data.data);
```

---

**文档版本**: v1.0  
**最后更新**: 2026-03-09  
**维护者**: 随行 🦞
