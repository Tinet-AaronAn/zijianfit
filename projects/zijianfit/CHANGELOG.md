# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-03-03

#### 后端
- ✨ **用户名密码登录系统**
  - POST /api/auth/register - 用户注册
  - POST /api/auth/login - 用户登录
  - GET /api/auth/me - 获取当前用户信息
  - POST /api/auth/refresh - 刷新Token
- ✨ **安全中间件**
  - XSS 防护
  - 点击劫持防护
  - 内容安全策略
- ✨ **速率限制中间件** - 防止API滥用
- ✨ **日志系统** - 分级日志 + 文件记录
- ✨ **CORS 配置** - 支持跨域请求
- ✨ **测试用例** - 15个新测试用例
  - 注册测试：6个
  - 登录测试：4个
  - 认证测试：3个
  - 刷新Token：2个
- ✨ **部署脚本**
  - start.sh - 一键启动
  - health-check.sh - 健康检查
  - test-login-api.sh - API测试脚本

#### 前端
- ✨ **RegisterScreen** - 用户注册页面
  - 用户名/密码/确认密码/昵称输入
  - 实时验证（格式/强度/一致性）
  - 密码强度提示
- 🔄 **LoginScreen** - 重写为用户名密码登录
  - 密码显示/隐藏切换
  - 表单验证
  - 加载状态
- 🔄 **authService** - 更新认证服务
  - register() - 注册
  - login() - 登录
  - getCurrentUser() - 获取用户信息
  - refreshToken() - 刷新Token
- 🔄 **useAuthStore** - 更新状态管理
  - 添加 register() 方法
  - 更新 login() 方法

#### 数据库
- ✨ **User 表字段更新**
  - 新增 username (String, unique)
  - 新增 password (String)
  - openid 改为可选字段
- ✨ **数据库迁移** - 20260303094228_change_to_username_login

#### 文档
- ✨ **CHANGELOG.md** - 变更日志
- ✨ **LOGIN_CHANGE_REPORT.md** - 登录变更报告
- ✨ **LOGIN_REDESIGN.md** - 登录重设计文档
- ✨ **CHANGE_LOG.md** - 需求变更记录
- ✨ **TEST_REPORT.md** - 测试报告
- ✨ **FIX_REPORT.md** - 测试修复报告
- ✨ **ANDROID_TEST_GUIDE.md** - Android测试指南
- ✨ **VIDEO_KEYWORDS.md** - 视频搜索关键词
- 🔄 **README.md** - 全面更新项目状态
- 🔄 **DEPLOYMENT.md** - 部署指南

### Changed - 2026-03-03

#### 后端
- 🔄 **认证方式变更**: 微信登录 → 用户名密码登录
  - 移除 POST /api/auth/wechat
  - 移除 POST /api/auth/phone
- 🔄 **auth.controller.ts** - 完全重写
  - 使用 bcrypt 加密密码
  - JWT Token 有效期 7 天
  - 参数严格验证
- 🔄 **测试框架优化**
  - Jest 配置：maxWorkers: 1（串行运行）
  - Prisma 客户端统一管理
  - 测试数据唯一性处理

#### 前端
- 🔄 **导航配置更新** - 添加注册页面路由

### Removed - 2026-03-03

#### 后端
- ❌ **微信登录相关代码**
  - POST /api/auth/wechat
  - POST /api/auth/phone
  - wechat-node-sdk 依赖（未使用）

#### 前端
- ❌ **微信登录相关代码**
  - react-native-wechat-lib 依赖（未使用）

### Fixed - 2026-03-03

#### 测试
- 🐛 **测试用例修复** - 测试通过率从 89% → 100%
  - 修复 Prisma 客户端冲突
  - 修复测试数据竞态条件
  - 修复 Jest 配置问题
- 🐛 **createTestUser** - 添加 username/password 支持

### Security - 2026-03-03

- 🔒 **密码加密** - bcrypt (10 salt rounds)
- 🔒 **JWT Token** - 7天有效期
- 🔒 **安全头部** - XSS/点击劫持/内容安全策略
- 🔒 **速率限制** - 防止API滥用
- 🔒 **参数验证** - 严格验证所有输入

---

## [0.1.0] - 2026-02-28

### Added

#### 后端
- ✨ 项目初始化 (Koa + SQLite + Prisma)
- ✨ **6 个 API 接口**
  - POST /api/auth/wechat - 微信登录（已移除）
  - GET /api/auth/me - 获取用户信息
  - POST /api/auth/refresh - 刷新Token
  - GET /api/plans - 获取训练计划
  - GET /api/plans/:id - 获取训练详情
  - POST /api/progress - 记录训练进度
- ✨ **测试框架** - Jest + Supertest
  - 19个测试用例
- ✨ **初始数据** - 7天训练计划（26个动作）

#### 前端
- ✨ 项目初始化 (React Native 0.73+)
- ✨ **5 个页面**
  - LoginScreen - 登录页
  - HomeScreen - 首页
  - WorkoutDetailScreen - 训练详情
  - WorkoutSessionScreen - 开始训练
  - StatsScreen - 统计页
- ✨ **状态管理** - Zustand
- ✨ **导航系统** - React Navigation 6
- ✨ **视频播放组件** - VideoPlayer.tsx

#### 文档
- ✨ **PRD.md** - 产品需求文档
- ✨ **UI-DESIGN.md** - UI设计规范
- ✨ **ARCHITECTURE.md** - 系统架构
- ✨ **WORKOUT_PLAN_45.md** - 训练计划
- ✨ **VIDEO_RESOURCES.md** - 视频资源清单
- ✨ **DEVELOPMENT.md** - 开发指南

---

## 项目里程碑

- **2026-02-28**: 项目启动，需求设计完成
- **2026-03-01**: 后端API开发，前端页面开发
- **2026-03-02**: 测试修复，代码优化
- **2026-03-03**: **登录方式变更，项目完成度 98%** 🎉

---

## 统计数据

### 代码变更（2026-03-03）
- 新增文件：28个
- 修改文件：21个
- 代码行数：~3600行
- 文档行数：~2000行

### 功能完成度
- 后端API：6/6 (100%)
- 前端页面：6/6 (100%)
- 测试用例：19/19 (100%)
- 文档：25+ (100%)
- **总体进度：98%**

---

## 下一步计划

### Day 2 (2026-03-04)
- [ ] Android 真机测试
- [ ] 视频资源收集（13/14）
- [ ] Bug 修复

### Day 3 (2026-03-05)
- [ ] iOS 真机测试
- [ ] UI 打磨
- [ ] 打包发布

---

*最后更新：2026-03-03 21:50*  
*维护者：官文（Doc Agent）📝*
