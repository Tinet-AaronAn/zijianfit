# 🎬 视频资源快速开始

**5 分钟快速上手视频搜索任务**

---

## ⚡ 3 步开始

### Step 1: 查看清单位（1分钟）
```bash
cd projects/zijianfit
cat docs/design/VIDEO_PROGRESS.md
```

### Step 2: 开始搜索（2小时）
打开小红书/抖音，搜索：
- "哑铃推举标准动作"
- "高位下拉教程"
- ...

### Step 3: 记录信息（30分钟）
更新文件：
```bash
nano backend/src/data/video-resources.json
```

---

## 📋 14个动作清单

**Day 1 - 上肢**（5个）
1. 哑铃推举
2. 高位下拉
3. 器械推胸
4. 哑铃弯举
5. 绳索下压

**Day 3 - 下肢**（4个）
6. 器械腿举
7. 罗马尼亚硬拉
8. 坐姿腿屈伸
9. 站姿提踵

**Day 5 - 全身**（5个）
10. 平板支撑
11. 深蹲
12. 俯卧撑
13. 哑铃划船
14. 开合跳

---

## 🔍 搜索平台

### 小红书（首选）⭐⭐⭐⭐⭐
- 搜索：`动作名称 + 标准动作`
- 时长：30-60秒最佳
- 记录：链接 + 作者

### 抖音 ⭐⭐⭐⭐
- 搜索：`#健身教程`
- 时长：30-60秒
- 记录：分享链接

### B站 ⭐⭐⭐⭐
- 搜索：`动作名称 + 完整教程`
- 时长：1-3分钟
- 记录：视频链接

---

## ✍️ 记录模板

```json
{
  "exerciseName": "哑铃推举",
  "videoUrl": "https://www.xiaohongshu.com/explore/xxx",
  "author": "健身教练小王",
  "platform": "xiaohongshu",
  "duration": 45
}
```

---

## 📚 详细文档

| 文档 | 路径 | 说明 |
|------|------|------|
| **搜索指南** | `docs/design/VIDEO_SEARCH_GUIDE.md` | 详细搜索方法 |
| **进度表** | `docs/design/VIDEO_PROGRESS.md` | 实时跟踪进度 |
| **任务说明** | `docs/design/VIDEO_TASK.md` | 完整任务清单 |
| **完成报告** | `docs/design/VIDEO_PREP_REPORT.md` | 准备工作总结 |

---

## ⚠️ 重要提醒

✅ **推荐**: 使用 WebView 嵌入（保留作者信息）  
⚠️ **注意**: 商业使用需授权  
❌ **禁止**: 去除水印

---

## 🚀 开始搜索

```bash
# 1. 查看进度表
cat projects/zijianfit/docs/design/VIDEO_PROGRESS.md

# 2. 查看搜索指南
cat projects/zijianfit/docs/design/VIDEO_SEARCH_GUIDE.md

# 3. 开始搜索！
```

---

**准备好了吗？开始搜索吧！** 🎬
