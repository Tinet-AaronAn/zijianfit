# 自健身 App - 测试文档

**项目**: 自健身 App MVP  
**版本**: v1.0  
**最后更新**: 2026-03-01

---

## 📋 测试概览

### 测试范围

| 层级 | 工具 | 状态 |
|------|------|------|
| **后端 API 测试** | Jest + Supertest | ✅ 已搭建 |
| **单元测试** | Jest | ⏳ 框架已准备 |
| **前端 E2E 测试** | Detox | 📝 待前端完成 |
| **Mock 数据** | 自定义 | ✅ 已完成 |

### 测试用例统计

| 模块 | 文件 | P0 | P1 | P2 | 总计 |
|------|------|----|----|----|----|
| 认证 | TC-AUTH.md | 7 | 3 | - | 10 |
| 训练流程 | TC-WORKOUT.md | 8 | 7 | - | 15 |
| 统计打卡 | TC-STATS.md | 3 | 6 | 1 | 10 |
| 推送通知 | TC-NOTIFICATION.md | 1 | 8 | 3 | 12 |
| 异常处理 | TC-ERROR.md | 3 | 12 | 5 | 20 |
| **总计** | - | **22** | **36** | **9** | **67** |

---

## 📁 目录结构

```
zijianfit/
├── backend/
│   └── tests/                    # 后端测试
│       ├── setup.ts              # 测试环境配置
│       ├── helpers/
│       │   └── testDb.ts         # 测试数据库辅助
│       └── backend/
│           ├── auth.test.ts      # 认证 API 测试
│           └── plans.test.ts     # 计划 API 测试
│
├── tests/                        # 测试总目录
│   ├── test-cases/               # 测试用例文档
│   │   ├── TC-AUTH.md
│   │   ├── TC-WORKOUT.md
│   │   ├── TC-STATS.md
│   │   ├── TC-NOTIFICATION.md
│   │   └── TC-ERROR.md
│   │
│   ├── mocks/                    # Mock 数据
│   │   ├── apiResponses.ts       # API 响应 Mock
│   │   ├── userData.ts           # 用户数据 Mock
│   │   └── workoutData.ts        # 训练数据 Mock
│   │
│   ├── unit/                     # 单元测试（待补充）
│   │   ├── stores/
│   │   └── utils/
│   │
│   ├── e2e/                      # E2E 测试（待前端完成）
│   │
│   ├── README.md                 # 本文件
│   └── TESTING_GUIDE.md          # 测试指南
│
└── docs/
    └── testing/
        └── TEST_SCENARIOS.md     # 测试场景规划
```

---

## 🚀 快速开始

### 后端 API 测试

```bash
# 进入后端目录
cd projects/zijianfit/backend

# 安装测试依赖
npm install --save-dev jest supertest @types/jest ts-jest

# 运行测试
npm test

# 运行测试（监听模式）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 使用 Mock 数据

```typescript
// 在前端开发中使用 Mock 数据
import { mockCurrentPlanResponse } from '../tests/mocks/apiResponses';

// API 调用示例
const fetchPlan = async () => {
  // 开发环境使用 Mock
  if (__DEV__) {
    return mockCurrentPlanResponse;
  }
  
  // 生产环境调用真实 API
  return axios.get('/api/plans/current');
};
```

---

## 📚 测试文档

- **测试场景规划**: `docs/testing/TEST_SCENARIOS.md`
- **测试指南**: `tests/TESTING_GUIDE.md`
- **后端测试 README**: `backend/tests/README.md`

---

## ✅ 已完成

- [x] 测试场景规划文档
- [x] 测试用例设计（5 个模块，67 个用例）
- [x] 后端 API 测试框架（Jest + Supertest）
- [x] 测试数据库辅助函数
- [x] Mock 数据（API 响应、用户、训练）
- [x] 测试文档

---

## 🚧 进行中

- [ ] 后端 API 测试用例补充
- [ ] 单元测试（工具函数、Store）
- [ ] 测试覆盖率提升

---

## 📝 待完成

- [ ] 前端 E2E 测试（Detox）
- [ ] 性能测试
- [ ] 安全测试（渗透测试）
- [ ] CI/CD 集成

---

## 📊 测试覆盖率目标

| 模块 | 当前 | 目标 |
|------|------|------|
| 后端 API | 0% | 80% |
| 工具函数 | 0% | 90% |
| Store | 0% | 70% |
| E2E | 0% | 核心流程覆盖 |

---

**测试负责人**: 陆测  
**联系方式**: -
