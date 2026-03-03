# 单元测试

**状态**: 框架已准备，待补充测试用例

---

## 目录结构

```
unit/
├── stores/              # Zustand Store 测试
│   ├── authStore.test.ts
│   ├── planStore.test.ts
│   └── progressStore.test.ts
│
├── utils/               # 工具函数测试
│   ├── dateHelper.test.ts
│   ├── storage.test.ts
│   └── validation.test.ts
│
└── components/          # 组件测试（可选）
    └── ...
```

---

## 示例：Store 测试

```typescript
// stores/authStore.test.ts
import { useAuthStore } from '../../../mobile/src/store/useAuthStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // 重置 Store
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('应该设置用户', () => {
    const { setUser } = useAuthStore.getState();
    const mockUser = { id: '1', openid: 'test', phone: '138****8888' };

    setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('应该清除用户', () => {
    const { setUser, clearUser } = useAuthStore.getState();
    setUser({ id: '1' } as any);

    clearUser();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
```

---

## 示例：工具函数测试

```typescript
// utils/dateHelper.test.ts
import { getWeekNumber, formatDate, getDayOfWeek } from '../../../mobile/src/utils/dateHelper';

describe('日期工具', () => {
  describe('getWeekNumber', () => {
    it('应该返回正确的周数', () => {
      const date = new Date('2026-03-02');
      expect(getWeekNumber(date)).toBe(10);
    });
  });

  describe('formatDate', () => {
    it('应该格式化为 YYYY-MM-DD', () => {
      const date = new Date('2026-03-02');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-03-02');
    });
  });
});
```

---

## 运行单元测试

```bash
# 在项目根目录
npm test -- tests/unit

# 或在 package.json 中添加脚本
"test:unit": "jest tests/unit"
```

---

**待补充**: 根据实际代码实现补充测试用例
