# 测试数据场景

**版本**: v1.0  
**日期**: 2026-03-01

---

## 1. 用户场景数据

### 1.1 新用户场景

```typescript
// 场景：用户首次打开 App，未登录
{
  user: null,
  token: null,
  state: 'NEW_USER'
}
```

**测试用例**:
- TC-AUTH-001: 新用户首次使用微信登录
- TC-AUTH-007: 手机号授权拒绝处理

### 1.2 已登录用户场景

```typescript
// 场景：用户已登录，Token 有效
{
  user: {
    id: 'user-001',
    openid: 'openid_001',
    phone: '138****8888',
    nickname: '测试用户'
  },
  token: 'valid_jwt_token',
  state: 'LOGGED_IN'
}
```

**测试用例**:
- TC-AUTH-002: 老用户自动登录
- TC-AUTH-010: 获取当前用户信息

### 1.3 Token 过期场景

```typescript
// 场景：用户 Token 已过期
{
  user: { id: 'user-001' },
  token: 'expired_jwt_token',
  state: 'TOKEN_EXPIRED'
}
```

**测试用例**:
- TC-AUTH-003: Token 过期自动刷新
- TC-AUTH-004: Token 刷新失败跳转登录页

---

## 2. 训练计划场景数据

### 2.1 本周计划场景

```typescript
// 场景：第 10 周计划，4 训练日 + 3 休息日
{
  plan: {
    weekNumber: 10,
    year: 2026,
    days: [
      { dayOfWeek: 1, isRestDay: false, exerciseCount: 8 },
      { dayOfWeek: 2, isRestDay: true },
      { dayOfWeek: 3, isRestDay: false, exerciseCount: 6 },
      { dayOfWeek: 4, isRestDay: true },
      { dayOfWeek: 5, isRestDay: false, exerciseCount: 5 },
      { dayOfWeek: 6, isRestDay: true },
      { dayOfWeek: 7, isRestDay: false, exerciseCount: 7 },
    ]
  }
}
```

**测试用例**:
- TC-WORKOUT-001: 查看本周训练计划
- TC-WORKOUT-002: 查看训练日详情
- TC-WORKOUT-003: 查看休息日

### 2.2 训练日详情场景

```typescript
// 场景：周一训练日，8 个动作
{
  dayPlan: {
    dayOfWeek: 1,
    isRestDay: false,
    exercises: [
      { name: '哑铃推举', sets: 2, reps: 12 },
      { name: '高位下拉', sets: 2, reps: 12 },
      { name: '坐姿划船', sets: 2, reps: 12 },
      { name: '稳态慢跑', sets: 1, duration: 20 },
      // ...
    ]
  }
}
```

**测试用例**:
- TC-WORKOUT-002: 查看训练日详情

### 2.3 休息日场景

```typescript
// 场景：周二休息日
{
  dayPlan: {
    dayOfWeek: 2,
    isRestDay: true,
    exercises: []
  }
}
```

**测试用例**:
- TC-WORKOUT-003: 查看休息日

---

## 3. 训练进度场景数据

### 3.1 未开始训练

```typescript
// 场景：训练日，未开始
{
  progress: {
    date: '2026-03-02',
    isCompleted: false,
    completedExercises: [],
    completedSets: {}
  }
}
```

### 3.2 训练进行中

```typescript
// 场景：完成了 2 个动作，第 3 个动作进行到一半
{
  progress: {
    date: '2026-03-02',
    isCompleted: false,
    completedExercises: ['ex-001', 'ex-002'],
    completedSets: {
      'ex-001': 2, // 完成 2 组（全部）
      'ex-002': 2, // 完成 2 组（全部）
      'ex-003': 1  // 完成 1 组（进行中）
    }
  }
}
```

**测试用例**:
- TC-WORKOUT-006: 完成一组动作
- TC-WORKOUT-010: 中途退出训练

### 3.3 训练完成

```typescript
// 场景：全部训练完成
{
  progress: {
    date: '2026-03-02',
    isCompleted: true,
    completedExercises: ['ex-001', 'ex-002', 'ex-003', 'ex-004'],
    completedSets: {
      'ex-001': 2,
      'ex-002': 2,
      'ex-003': 2,
      'ex-004': 1
    },
    completedAt: '2026-03-02T20:30:00Z'
  }
}
```

**测试用例**:
- TC-WORKOUT-009: 完成整个训练
- TC-STATS-001: 完成训练自动打卡

---

## 4. 统计场景数据

### 4.1 本周统计（部分完成）

```typescript
// 场景：完成了 3/4 训练日
{
  stats: {
    weekNumber: 10,
    year: 2026,
    totalTrainingDays: 4,
    completedDays: 3,
    completionRate: 0.75,
    totalExercises: 26,
    completedExercises: 18
  }
}
```

**测试用例**:
- TC-STATS-002: 查看周统计
- TC-STATS-004: 完成率计算正确性

### 4.2 打卡日历

```typescript
// 场景：3 月打卡记录
{
  checkins: [
    { date: '2026-03-02', isCompleted: true },
    { date: '2026-03-04', isCompleted: true },
    { date: '2026-03-06', isCompleted: true },
    { date: '2026-03-08', isCompleted: false },
  ]
}
```

**测试用例**:
- TC-STATS-003: 查看打卡日历

---

## 5. 异常场景数据

### 5.1 网络异常

```typescript
// 场景：网络断开
{
  network: 'OFFLINE',
  lastSync: '2026-03-02T20:00:00Z',
  pendingChanges: [
    { type: 'CHECKIN', data: { date: '2026-03-02' } },
    { type: 'SET_COMPLETE', data: { exerciseId: 'ex-001', setNumber: 1 } }
  ]
}
```

**测试用例**:
- TC-ERROR-001: 网络断开
- TC-ERROR-007: 数据同步失败

### 5.2 服务器错误

```typescript
// 场景：服务器返回 500
{
  statusCode: 500,
  errorCode: 'INTERNAL_ERROR',
  message: '服务器内部错误'
}
```

**测试用例**:
- TC-ERROR-002: 服务器 500 错误

### 5.3 视频加载失败

```typescript
// 场景：视频 URL 失效
{
  videoUrl: 'https://invalid-url/video.mp4',
  error: 'VIDEO_LOAD_FAILED',
  fallback: null
}
```

**测试用例**:
- TC-ERROR-004: 视频加载失败
- TC-ERROR-005: 视频格式不支持

---

## 6. 推送通知场景数据

### 6.1 提醒已设置

```typescript
// 场景：用户设置了 20:00 提醒
{
  notification: {
    enabled: true,
    time: '20:00',
    permission: 'granted',
    nextTrigger: '2026-03-02T12:00:00Z'
  }
}
```

**测试用例**:
- TC-NOTIF-001: 设置训练提醒时间
- TC-NOTIF-005: 收到推送通知

### 6.2 提醒未开启

```typescript
// 场景：用户关闭了提醒
{
  notification: {
    enabled: false,
    permission: 'granted'
  }
}
```

### 6.3 无权限

```typescript
// 场景：用户拒绝了通知权限
{
  notification: {
    enabled: true,
    permission: 'denied'
  }
}
```

**测试用例**:
- TC-NOTIF-004: 拒绝通知权限

---

## 7. 边界场景数据

### 7.1 空数据

```typescript
// 场景：新用户，无任何数据
{
  plans: [],
  progress: [],
  stats: null
}
```

**测试用例**:
- TC-STATS-005: 无训练记录时的统计
- TC-ERROR-017: 空数据列表

### 7.2 最大数据量

```typescript
// 场景：一年的训练记录
{
  plans: Array(52), // 52 周计划
  progress: Array(365), // 365 天进度
  stats: { /* 年度统计 */ }
}
```

### 7.3 并发请求

```typescript
// 场景：同时发起多个打卡请求
{
  requests: [
    { type: 'CHECKIN', timestamp: '2026-03-02T20:30:00.000Z' },
    { type: 'CHECKIN', timestamp: '2026-03-02T20:30:00.100Z' }
  ]
}
```

**测试用例**:
- TC-ERROR-015: 并发打卡

---

## 8. 测试数据生成器

### 8.1 批量生成用户

```typescript
function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i}`,
    openid: `openid-${i}`,
    phone: `1${i % 10}****${String(i).padStart(4, '0')}`,
    nickname: `用户${i}`,
    createdAt: new Date().toISOString()
  }));
}
```

### 8.2 批量生成训练计划

```typescript
function generatePlans(userId: string, weeks: number): Plan[] {
  return Array.from({ length: weeks }, (_, i) => ({
    id: `plan-${i}`,
    userId,
    weekNumber: i + 1,
    year: 2026
  }));
}
```

---

**最后更新**: 2026-03-01
