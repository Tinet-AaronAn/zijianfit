# Day 2 任务清单

**日期**: 2026-03-04  
**主要目标**: 微信SDK集成 + 真机测试 + 视频资源准备

---

## 🎯 核心任务

### 1. 微信SDK集成（优先级 P0）⭐

**负责人**: 安老师

#### 1.1 微信开放平台账号（上午）
- [ ] 访问 https://open.weixin.qq.com/
- [ ] 注册账号（个人/企业）
- [ ] 完成开发者资质认证
- [ ] 创建移动应用（应用名称：自健身）
- [ ] 填写应用信息
- [ ] 提交审核（1-3 工作日）

**预计时间**: 1-2 小时  
**费用**: 个人免费，企业 300 元/年

---

#### 1.2 前端集成（审核通过后）

**iOS 配置**:
```bash
# 1. 安装依赖
cd projects/zijianfit/mobile
npm install react-native-wechat-lib

# 2. 配置 Info.plist
# 参考: docs/integration/WECHAT_SDK_GUIDE.md

# 3. 安装 Pods
cd ios && pod install && cd ..

# 4. 编译运行
npm run ios
```

**Android 配置**:
```bash
# 1. 配置 build.gradle
# 参考: docs/integration/WECHAT_SDK_GUIDE.md

# 2. 创建 WXEntryActivity.java
# 参考: docs/integration/WECHAT_SDK_GUIDE.md

# 3. 编译运行
npm run android
```

**预计时间**: 2-3 小时

---

#### 1.3 代码实现

**登录流程**:
```typescript
// src/screens/LoginScreen.tsx
import { WeChat } from 'react-native-wechat-lib';

const handleWeChatLogin = async () => {
  // 1. 检查微信安装
  const isInstalled = await WeChat.isWXAppInstalled();
  if (!isInstalled) {
    Alert.alert('提示', '请先安装微信');
    return;
  }

  // 2. 发起授权
  const result = await WeChat.sendAuthRequest('snsapi_userinfo');
  
  // 3. 发送到后端
  const response = await authService.wechatLogin(result.code);
  
  // 4. 保存 token
  useAuthStore.getState().login(response.data);
  
  // 5. 跳转首页
  navigation.navigate('Home');
};
```

**手机号授权**:
```typescript
// src/screens/ProfileScreen.tsx
const handleGetPhoneNumber = async () => {
  const result = await WeChat.getPhoneNumber();
  await authService.bindPhone(result.encryptedData, result.iv);
  Alert.alert('成功', '手机号绑定成功');
};
```

**预计时间**: 1-2 小时

---

#### 1.4 测试验证

- [ ] 微信已安装检测
- [ ] 授权页面跳转
- [ ] 授权成功返回
- [ ] 用户信息获取
- [ ] Token 保存
- [ ] 自动登录
- [ ] 手机号授权
- [ ] 退出登录

**预计时间**: 1 小时

---

### 2. 真机测试（优先级 P0）⭐

**负责人**: 安老师

#### 2.1 iOS 测试

**准备工作**:
- [ ] 准备 iPhone 设备
- [ ] 连接 Mac 电脑
- [ ] Xcode 已安装
- [ ] Apple ID 已配置

**测试步骤**:
```bash
cd projects/zijianfit/mobile
npm run ios
```

**测试清单**:
- [ ] 应用启动正常
- [ ] 微信登录流程（需要 SDK）
- [ ] 查看周计划
- [ ] 训练详情展示
- [ ] 开始训练流程
- [ ] 视频播放
- [ ] 打卡记录
- [ ] 统计展示
- [ ] UI 响应流畅
- [ ] 无崩溃

**预计时间**: 2 小时

---

#### 2.2 Android 测试

**准备工作**:
- [ ] 准备 Android 设备
- [ ] 开启开发者模式和 USB 调试
- [ ] 连接电脑

**测试步骤**:
```bash
cd projects/zijianfit/mobile
npm run android
```

**测试清单**:
- [ ] 应用启动正常
- [ ] 微信登录流程（需要 SDK）
- [ ] 查看周计划
- [ ] 训练详情展示
- [ ] 开始训练流程
- [ ] 视频播放
- [ ] 打卡记录
- [ ] 统计展示
- [ ] UI 响应流畅
- [ ] 无崩溃

**预计时间**: 2 小时

---

### 3. 视频资源准备（优先级 P1）

**负责人**: 待定

#### 3.1 搜索视频（14个动作）

**使用脚本**:
```bash
cd projects/zijianfit
bash scripts/search-videos.sh
```

**搜索平台**:
- 小红书（推荐，短视频丰富）
- 抖音（健身达人多）
- B站（教程详细）

**搜索关键词**:
```
哑铃推举标准动作
高位下拉教程
器械推胸示范
...
（参考 scripts/search-videos.sh）
```

**预计时间**: 2-3 小时

---

#### 3.2 记录视频信息

**数据格式**:
```json
{
  "exerciseId": "ex-1",
  "exerciseName": "哑铃推举",
  "videoUrl": "https://...",
  "platform": "xiaohongshu",
  "author": "博主名称",
  "duration": 45,
  "authorized": false,
  "notes": "标准动作示范"
}
```

**保存位置**: `backend/src/data/video-resources.json`

---

#### 3.3 更新数据库

**添加 videoUrl 字段**:
```sql
-- Prisma schema 更新
model Exercise {
  // ... 其他字段
  videoUrl String @default("")
}
```

**运行迁移**:
```bash
cd projects/zijianfit/backend
npx prisma migrate dev --name add-video-url
```

**更新种子数据**:
```bash
npm run prisma:seed
```

**预计时间**: 1 小时

---

### 4. Bug 修复（优先级 P1）

**负责人**: 根据测试结果

#### 4.1 根据真机测试结果

**常见问题**:
- [ ] UI 布局适配问题
- [ ] 视频播放卡顿
- [ ] 网络请求失败
- [ ] 状态管理异常
- [ ] 导航逻辑问题

**修复流程**:
1. 记录 Bug 详情
2. 定位问题代码
3. 修复并测试
4. 提交代码

**预计时间**: 2-3 小时

---

#### 4.2 优化测试用例

**目标**: 提高测试通过率至 95%+

- [ ] 修复剩余 2 个测试
- [ ] 增加边界测试
- [ ] 优化测试数据创建

**预计时间**: 1 小时

---

## 📋 任务时间表

### 上午（9:00-12:00）

**9:00-10:00** 微信开放平台账号申请
- 注册账号
- 创建应用
- 提交审核

**10:00-12:00** 视频资源搜索
- 搜索 14 个动作视频
- 记录视频信息
- 整理数据

---

### 下午（14:00-18:00）

**14:00-16:00** 真机测试（iOS）
- 启动应用
- 完整流程测试
- 记录问题

**16:00-17:00** 真机测试（Android）
- 启动应用
- 完整流程测试
- 记录问题

**17:00-18:00** Bug 修复
- 修复测试发现的问题
- 优化体验

---

### 晚上（19:00-21:00）

**19:00-20:00** 微信SDK前端集成（如果审核通过）
- 配置原生代码
- 实现登录流程

**20:00-21:00** 代码整理
- 提交代码
- 更新文档
- 准备 Day 3

---

## ✅ 完成标准

### Day 2 完成标准

**必须完成**:
- [x] 微信开放平台账号申请完成
- [x] 至少 10 个视频资源找到
- [x] iOS 或 Android 真机测试完成
- [x] 主要 Bug 修复

**理想完成**:
- [x] 微信SDK集成完成（如果审核通过）
- [x] 14 个视频资源全部找到
- [x] iOS 和 Android 都测试完成
- [x] 测试通过率提升至 95%+

---

## 🚨 风险预警

### 可能遇到的问题

1. **微信审核慢**
   - 影响：无法当天集成 SDK
   - 应对：先完成其他任务，审核通过后再集成

2. **视频版权问题**
   - 影响：无法使用找到的视频
   - 应对：使用 WebView 嵌入，或联系授权

3. **真机测试失败**
   - 影响：发现严重 Bug
   - 应对：及时修复，必要时调整计划

4. **原生配置问题**
   - 影响：SDK 集成失败
   - 应对：查阅官方文档，社区求助

---

## 📞 需要帮助时

**技术问题**:
- 查看 `docs/integration/WECHAT_SDK_GUIDE.md`
- 查看官方文档：https://open.weixin.qq.com/
- React Native 文档：https://reactnative.dev/

**联系支持**:
- 微信开放平台客服
- React Native 社区
- 随行 AI 助手 🦞

---

## 📊 进度追踪

**Day 1**: ✅ 95% 完成
- 后端 + 前端 + 测试 + 文档

**Day 2**: 🔄 进行中
- 微信SDK + 真机测试 + 视频资源

**Day 3**: ⏳ 待开始
- 推送通知 + UI 打磨 + 打包

---

**加油！Day 2 会很充实！** 💪
