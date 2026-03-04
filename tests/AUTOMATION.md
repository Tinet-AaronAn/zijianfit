# 自动化测试说明

**版本**: v1.0  
**日期**: 2026-03-01

---

## 1. CI/CD 集成

### 1.1 GitHub Actions 配置

创建 `.github/workflows/test.yml`：

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Generate Prisma Client
        working-directory: ./backend
        run: npx prisma generate
      
      - name: Run tests
        working-directory: ./backend
        run: npm run test:ci
        env:
          NODE_ENV: test
          DATABASE_URL: "file:./test.db"
          JWT_SECRET: test_jwt_secret
          JWT_EXPIRES_IN: 1h
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./backend/coverage/lcov.info
          flags: backend
```

---

## 2. 本地自动化

### 2.1 Pre-commit Hook

使用 Husky 在提交前自动运行测试：

```bash
# 安装 Husky
npm install --save-dev husky lint-staged

# 初始化 Husky
npx husky init

# 创建 pre-commit hook
echo "npm test" > .husky/pre-commit
```

### 2.2 lint-staged 配置

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "jest --bail --findRelatedTests"]
  }
}
```

---

## 3. 测试脚本

### 3.1 完整测试套件

```bash
# 运行所有测试
npm run test:all

# 后端 + 前端单元测试
npm run test:unit

# E2E 测试
npm run test:e2e
```

### 3.2 Makefile（可选）

创建 `Makefile`：

```makefile
.PHONY: test test-backend test-frontend test-e2e coverage

test: test-backend test-frontend

test-backend:
	cd backend && npm test

test-frontend:
	cd mobile && npm test

test-e2e:
	cd mobile && npm run test:e2e

coverage:
	cd backend && npm run test:coverage
	open backend/coverage/lcov-report/index.html
```

---

## 4. 测试报告

### 4.1 Jest JUnit 报告

```bash
npm run test:ci
```

生成 `junit.xml`，供 CI/CD 系统解析。

### 4.2 覆盖率报告

```bash
npm run test:coverage
```

生成 HTML 报告：`coverage/lcov-report/index.html`

---

## 5. 性能测试

### 5.1 API 压力测试（可选）

使用 k6 或 Artillery：

```bash
# 安装 k6
brew install k6

# 运行压力测试
k6 run tests/performance/api-load.js
```

示例脚本 `api-load.js`：

```javascript
import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3001/api/plans/current');
}
```

---

## 6. 监控与告警

### 6.1 测试失败通知

CI/CD 中配置失败通知（Slack / 钉钉 / Email）。

### 6.2 覆盖率阈值

在 `jest.config.js` 中设置：

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

**最后更新**: 2026-03-01
