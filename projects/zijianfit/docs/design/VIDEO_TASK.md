# 🎬 视频资源准备任务

**任务状态**: 🔄 进行中  
**负责人**: 安老师  
**开始时间**: 2026-03-03  
**截止时间**: Day 2 结束前  

---

## ✅ 已完成准备工作

### 1. 数据结构已就绪
- ✅ 数据库 schema 已更新（添加 videoUrl, videoSource, videoAuthor, videoDuration）
- ✅ Prisma schema 已更新
- ✅ 视频资源 JSON 文件已创建（14个动作）

### 2. 文档已完善
- ✅ **VIDEO_SEARCH_GUIDE.md** - 详细搜索指南（4.2KB）
- ✅ **VIDEO_PROGRESS.md** - 进度跟踪表
- ✅ **video-resources.json** - 完整数据清单（13.8KB）

### 3. 临时方案已就绪
- ✅ 所有动作都配置了临时测试视频
- ✅ VideoPlayer 组件已集成
- ✅ 视频播放功能正常

---

## 📋 待完成任务

### 优先级 P0 - 安老师操作

#### 1. 搜索视频（14个动作）

**平台推荐**：
- 小红书（首选）⭐⭐⭐⭐⭐
- 抖音 ⭐⭐⭐⭐
- B站 ⭐⭐⭐⭐

**搜索清单**：
```
Day 1 - 上肢力量（5个）
- [ ] 1. 哑铃推举
- [ ] 2. 高位下拉
- [ ] 3. 器械推胸
- [ ] 4. 哑铃弯举
- [ ] 5. 绳索下压

Day 3 - 下肢力量（4个）
- [ ] 6. 器械腿举
- [ ] 7. 罗马尼亚硬拉
- [ ] 8. 坐姿腿屈伸
- [ ] 9. 站姿提踵

Day 5 - 全身循环（5个）
- [ ] 10. 平板支撑
- [ ] 11. 深蹲
- [ ] 12. 俯卧撑
- [ ] 13. 哑铃划船
- [ ] 14. 开合跳
```

**预计时间**：2-3 小时

---

#### 2. 记录视频信息

**必填信息**：
- ✅ 视频链接（URL）
- ✅ 作者/博主名称
- ✅ 视频时长（秒）
- ✅ 平台来源（小红书/抖音/B站）

**可选信息**：
- ⭐ 视频质量评分（1-5星）
- ⭐ 备注（动作特点等）

**预计时间**：30 分钟

---

#### 3. 更新数据文件

**方式 1：直接编辑 JSON**（推荐）
```bash
cd projects/zijianfit/backend/src/data
nano video-resources.json
# 找到对应动作，更新 videoUrl 和 author
```

**方式 2：使用进度表**
```bash
cd projects/zijianfit/docs/design
nano VIDEO_PROGRESS.md
# 更新状态和视频链接
```

**预计时间**：30 分钟

---

### 优先级 P1 - 开发团队操作

#### 4. 数据库迁移

**前提**：完成 14 个视频搜索

**步骤**：
```bash
cd projects/zijianfit/backend

# 1. 生成迁移文件
npx prisma migrate dev --name add-video-fields

# 2. 更新种子数据
npm run prisma:seed

# 3. 验证数据
npx prisma studio
```

**预计时间**：30 分钟

---

#### 5. 前端集成

**步骤**：
```bash
cd projects/zijianfit/mobile

# 1. 更新类型定义
# 在 src/types/index.ts 中添加 videoSource, videoAuthor 字段

# 2. 更新 workoutService
# 确保从 API 获取完整数据

# 3. 更新 VideoPlayer 组件
# 支持从不同平台播放

# 4. 测试播放
npm run ios  # 或 npm run android
```

**预计时间**：1 小时

---

## 📂 关键文件位置

| 类型 | 文件 | 用途 |
|------|------|------|
| **搜索指南** | `docs/design/VIDEO_SEARCH_GUIDE.md` | 详细的搜索方法和技巧 |
| **进度跟踪** | `docs/design/VIDEO_PROGRESS.md` | 实时更新搜索进度 |
| **资源数据** | `backend/src/data/video-resources.json` | 完整的视频资源清单 |
| **数据库模型** | `backend/prisma/schema.prisma` | Exercise 表定义 |

---

## 🚀 快速开始

### 查看搜索指南
```bash
cat projects/zijianfit/docs/design/VIDEO_SEARCH_GUIDE.md
```

### 查看当前进度
```bash
cat projects/zijianfit/docs/design/VIDEO_PROGRESS.md
```

### 查看数据结构
```bash
cat projects/zijianfit/backend/src/data/video-resources.json | head -50
```

---

## ⚠️ 重要提醒

### 版权问题
- ✅ **推荐**：使用 WebView 嵌入（保留作者信息）
- ⚠️ **谨慎**：直接下载视频（需授权）
- ❌ **禁止**：去除水印、未授权商业使用

### 视频质量标准
- ✅ 动作标准、示范清晰
- ✅ 时长 30-120 秒（最佳 45-60 秒）
- ✅ 画面质量清晰
- ✅ 有专业教练示范

---

## 📊 成功标准

**完成标志**：
- [ ] 14 个动作全部找到合适的视频
- [ ] 所有视频链接已记录到 `video-resources.json`
- [ ] 每个视频都有作者信息
- [ ] 视频时长已标注
- [ ] 进度表已更新至 100%

---

## 🎯 时间规划

**建议安排**：
- **今天下午**：搜索 7-10 个视频（Day 1 + Day 3）
- **明天上午**：搜索剩余 4-7 个视频（Day 5）
- **明天下午**：更新数据库 + 前端集成

---

## 📞 需要帮助？

### 查看文档
- 搜索指南：`docs/design/VIDEO_SEARCH_GUIDE.md`
- 进度表：`docs/design/VIDEO_PROGRESS.md`

### 联系支持
- 技术问题：查看 `docs/integration/` 目录
- 开发团队：随行 AI 助手 🦞

---

**祝搜索顺利！** 🎬

安老师，您可以开始搜索视频了。所有工具和文档都已准备就绪！
