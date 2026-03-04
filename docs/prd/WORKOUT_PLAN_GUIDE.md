# 训练计划数据使用指南

**版本**: v1.0
**日期**: 2026-02-28
**负责人**: 行兵（编码）

---

## 1. 已准备的数据文件

### 1.1 原始文档
- **路径**: `docs/prd/WORKOUT_PLAN_45.md`
- **格式**: Markdown
- **内容**: 完整的 45 岁降血糖+降血脂健身计划（原始版本）

### 1.2 结构化数据
- **路径**: `backend/src/data/seed-plan-45.json`
- **格式**: JSON
- **内容**: 可直接导入数据库的训练计划数据

### 1.3 数据库种子脚本
- **路径**: `backend/prisma/seed.ts`
- **格式**: TypeScript
- **功能**: 将 JSON 数据导入 SQLite 数据库

---

## 2. 数据结构说明

### 2.1 训练计划（Plan）
```json
{
  "planName": "45岁健身计划 - 降血糖+降血脂",
  "targetAudience": "45岁，需要控制血糖和血脂",
  "weeklyDuration": "160分钟",
  "days": [...] // 7 天计划
}
```

### 2.2 每日计划（DayPlan）
```json
{
  "dayOfWeek": 1,
  "dayName": "周一",
  "isRestDay": false,
  "title": "上肢力量 + 稳态慢跑",
  "totalDuration": 50,
  "sections": [...] // 力量 + 有氧部分
}
```

### 2.3 训练部分（Section）
```json
{
  "type": "strength", // strength | cardio | hiit | circuit
  "name": "力量部分",
  "duration": 20,
  "exercises": [...]
}
```

### 2.4 动作（Exercise）
```json
{
  "name": "哑铃推举",
  "sets": 2,
  "reps": 12,
  "weight": "10-12kg/只",
  "restSeconds": 60,
  "videoUrl": "", // 待填充
  "description": "肩部训练，站姿或坐姿",
  "muscleGroup": "shoulders"
}
```

---

## 3. 如何使用

### 3.1 初始化数据库

```bash
# 进入后端目录
cd projects/zijianfit/backend

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移（创建表）
npx prisma migrate dev --name init

# 运行种子脚本（导入数据）
npx prisma db seed
```

### 3.2 查询训练计划

```typescript
// 查询本周计划
const plan = await prisma.plan.findFirst({
  where: { isActive: true },
  include: {
    days: {
      include: {
        exercises: true,
      },
    },
  },
});

// 查询某天的训练
const monday = await prisma.dayPlan.findFirst({
  where: {
    planId: plan.id,
    dayOfWeek: 1,
  },
  include: {
    exercises: {
      orderBy: { order: 'asc' },
    },
  },
});
```

### 3.3 前端展示

```typescript
// React Native 示例
import { useQuery } from '@tanstack/react-query';

function WeeklyPlanScreen() {
  const { data: plan } = useQuery({
    queryKey: ['plan'],
    queryFn: () => api.get('/plans/current'),
  });

  return (
    <View>
      {plan.days.map(day => (
        <DayCard
          key={day.dayOfWeek}
          day={day}
        />
      ))}
    </View>
  );
}
```

---

## 4. 需要补充的内容

### 4.1 视频链接
当前所有动作的 `videoUrl` 字段为空，需要填充：

| 动作 | 平台 | 优先级 | 状态 |
|------|------|--------|------|
| 哑铃推举 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 高位下拉 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 器械推胸 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 哑铃弯举 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 绳索下压 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 器械腿举 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 罗马尼亚硬拉 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 坐姿腿屈伸 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 站姿提踵 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 平板支撑 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 深蹲 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 俯卧撑 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 哑铃划船 | 小红书/抖音 | P0 | ⏳ 待搜索 |
| 开合跳 | 小红书/抖音 | P0 | ⏳ 待搜索 |

**建议**：
1. 先从抖音搜索这些动作的短视频
2. 使用 WebView 嵌入播放
3. 后续联系创作者获取授权或自建视频

### 4.2 动作图标
为每个动作添加图标，提升用户体验：

| 动作类型 | 图标建议 |
|---------|---------|
| 力量训练 | 💪 |
| 有氧运动 | 🏃 |
| HIIT | ⚡ |
| 拉伸 | 🧘 |
| 核心训练 | 🔥 |

---

## 5. 数据库扩展

### 5.1 新增训练计划
```typescript
// 为不同人群创建计划
const plans = [
  {
    name: '30岁增肌计划',
    targetAudience: '30岁，增肌',
    // ...
  },
  {
    name: '50岁减脂计划',
    targetAudience: '50岁，减脂',
    // ...
  },
];
```

### 5.2 动作库扩展
```typescript
// 创建独立动作库
const exerciseLibrary = [
  {
    name: '哑铃推举',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    videoUrl: 'https://...',
  },
  // ...
];
```

---

## 6. API 设计建议

### 6.1 获取当前计划
```http
GET /api/plans/current
Authorization: Bearer {token}

Response:
{
  "id": "plan-1",
  "name": "45岁健身计划",
  "days": [...]
}
```

### 6.2 获取某天训练
```http
GET /api/plans/{planId}/days/{dayOfWeek}
Authorization: Bearer {token}

Response:
{
  "dayOfWeek": 1,
  "title": "上肢力量 + 稳态慢跑",
  "sections": [...]
}
```

### 6.3 记录训练进度
```http
POST /api/progress/set-complete
Authorization: Bearer {token}

Body:
{
  "exerciseId": "ex-1",
  "setNumber": 1,
  "completed": true,
  "actualReps": 12
}
```

---

## 7. 前端页面映射

### 7.1 首页（周计划）
- 显示 7 天卡片
- 使用 `dayOfWeek` 排序
- 休息日显示灰色
- 训练日显示橙色

### 7.2 训练详情页
- 显示 `sections`（力量 + 有氧）
- 显示每个 `section` 下的 `exercises`
- 显示组数、次数、重量

### 7.3 开始训练页
- 按 `order` 顺序展示动作
- 显示当前组数/总组数
- 播放 `videoUrl` 视频
- 记录完成状态

---

## 8. 下一步行动

- [ ] 安装依赖并初始化数据库
- [ ] 运行种子脚本导入数据
- [ ] 测试 API 查询
- [ ] 搜索并填充视频链接
- [ ] 前端页面开发
- [ ] 集成视频播放功能

---

**更新日志**：
- 2026-02-28: 创建文档，初始化数据结构
