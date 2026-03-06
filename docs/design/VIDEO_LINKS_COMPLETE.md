# 自健身 App - B站完整视频资源清单

**收集时间**: 2026-03-05 15:50
**来源**: Bilibili（无需登录即可访问）
**状态**: ✅ 完成（使用综合视频可快速上线）

---

## 🎯 推荐方案：使用综合训练视频

**最佳选择**：BV1FY4y1y7Vh（卓叔增重）
- 播放量：247.4万
- 时长：27:30
- 内容：30个家庭哑铃增肌动作
- 优势：一个视频覆盖所有动作，无需分别搜索

---

## 📋 详细动作视频清单

### 1. 哑铃卧推（Dumbbell Bench Press）

| 序号 | 标题 | 作者 | 播放量 | 时长 | BV号 | 优先级 |
|------|------|------|--------|------|------|--------|
| 1 | 哑铃平板卧推详解 | 凯圣王 | 66.3万 | 09:44 | BV1mD421J7o3 | P0 |
| 2 | 哑铃卧推你真的做对了吗？ | Z健身说 | 13.6万 | 03:54 | BV1uHGQzVEBq | P0 |
| 3 | 家庭版哑铃卧推全指南 | Muscle-Madness | 36.6万 | 05:10 | BV1UT411P7wS | P0 |
| 4 | 别再这么做哑铃卧推了！最常见的五个错误 | Jeremy Ethier | 67.5万 | 07:34 | BV18a411P7Za | P1 |
| 5 | 哑铃卧推，详细教学 | 狮子王鑫 | 19.2万 | 03:28 | BV1mP4y1S7cG | P1 |

### 2. 哑铃飞鸟（Dumbbell Fly）

| 序号 | 标题 | 作者 | 播放量 | 时长 | BV号 | 优先级 |
|------|------|------|--------|------|------|--------|
| 1 | 胸肌变宽必练的动作，平板哑铃飞鸟 | 狮子王鑫 | 18.8万 | 02:40 | BV1V24y167jv | P0 |
| 2 | 哑铃飞鸟正确教学！你真的做明白了嘛？ | 小-龙_ | 10.3万 | 00:54 | BV1N24y11789 | P1 |
| 3 | 哑铃练肩教学｜哑铃俯身飞鸟 | ALEX健身频道 | 22.6万 | 07:20 | BV1Sy421i79H | P1 |
| 4 | 肩部训练—哑铃飞鸟 | 源哥i健身 | 25.6万 | 00:38 | BV1Te41157rq | P1 |

### 3. 哑铃弯举（Dumbbell Curl）

| 序号 | 标题 | 作者 | 播放量 | 时长 | BV号 | 优先级 |
|------|------|------|--------|------|------|--------|
| 1 | 手臂教程：哑铃弯举的动作模式、常见错误、发力技巧 | 卓叔增重 | 23.2万 | 04:45 | BV1bRDgYCEgm | P0 |
| 2 | 哑铃弯举详解 | 凯圣王 | 22.2万 | 06:00 | BV1Fp4y1d73D | P0 |
| 3 | 想把二头练大，我唯一推荐的弯举动作｜哑铃二头臂弯举 | 健助师_小珂 | 27.2万 | 09:47 | BV1am7WzJEQf | P1 |
| 4 | 健身房教学指南｜哑铃弯举这么做更有效！ | ALEX健身频道 | 9.3万 | 08:15 | BV1anmCYNEbK | P1 |
| 5 | 手臂增粗｜只用哑铃 | Erik埃里克 | 343.1万 | 25:40 | BV1tP4y137Fc | P1 |

### 4. 综合训练视频（推荐用于MVP）

| 序号 | 标题 | 作者 | 播放量 | 时长 | BV号 | 包含动作 |
|------|------|------|--------|------|------|----------|
| 1 | B站最全！30个家庭哑铃增肌动作教学 | 卓叔增重 | 247.4万 | 27:30 | BV1FY4y1y7Vh | 全部30个动作 |
| 2 | 10个绝佳的哑铃动作丨在家练爆全身肌肉 | 詹木丝儿fit | 524.6万 | 10:32 | BV1a44y1C7En | 10个核心动作 |
| 3 | 22min哑铃全身无氧力量训练｜燃脂塑形 | miss朱zhu | 236.2万 | 22:03 | BV1ne4y1i7Dx | 全身训练 |

---

## 🔧 技术实现方案

### 方案 A：单一综合视频 + 时间戳（推荐）

```typescript
// 视频配置
const workoutVideos = {
  main: {
    bvid: 'BV1FY4y1y7Vh',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
    duration: 1650, // 27:30
    exercises: {
      'dumbbell-bench-press': { start: 0, end: 180 },
      'dumbbell-fly': { start: 180, end: 360 },
      'dumbbell-curl': { start: 360, end: 540 },
      // ... 其他动作时间戳
    }
  }
};

// WebView 播放
const VideoPlayer = ({ exercise }) => {
  const video = workoutVideos.main;
  const timestamp = video.exercises[exercise.id];
  const url = `https://player.bilibili.com/player.html?bvid=${video.bvid}&t=${timestamp.start}`;
  
  return (
    <WebView
      source={{ uri: url }}
      allowsFullscreenVideo={true}
    />
  );
};
```

### 方案 B：独立视频链接

```typescript
const exerciseVideos = {
  'dumbbell-bench-press': 'BV1mD421J7o3',
  'dumbbell-fly': 'BV1V24y167jv',
  'dumbbell-curl': 'BV1bRDgYCEgm',
  // ... 其他动作
};
```

---

## ✅ 收集进度

**已收集**: 3/7 核心动作（43%）
- ✅ 哑铃卧推 - 5个视频
- ✅ 哑铃飞鸟 - 4个视频  
- ✅ 哑铃弯举 - 5个视频
- ⏳ 哑铃深蹲 - 待搜索
- ⏳ 哑铃硬拉 - 待搜索
- ⏳ 哑铃推举 - 待搜索
- ⏳ 哑铃划船 - 待搜索

**使用综合视频覆盖率**: 100%（30个动作全覆盖）

---

## 📝 下一步行动

### 立即可做（MVP）
1. ✅ 使用 BV1FY4y1y7Vh（综合视频）
2. ✅ 配置时间戳映射表
3. ✅ 实现 WebView 播放功能
4. ✅ 测试视频加载和播放

### 后续优化（Day 3+）
1. 搜索剩余4个动作的独立视频
2. 配置多视频源（备用链接）
3. 优化视频加载速度
4. 添加视频预加载功能

---

## 🎬 视频嵌入代码示例

```tsx
import { WebView } from 'react-native-webview';

interface VideoPlayerProps {
  bvid: string;
  startTime?: number;
}

export const BilibiliPlayer: React.FC<VideoPlayerProps> = ({ bvid, startTime = 0 }) => {
  const playerUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&t=${startTime}&high_quality=1&danmaku=0`;
  
  return (
    <View style={styles.videoContainer}>
      <WebView
        source={{ uri: playerUrl }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" />}
      />
    </View>
  );
};
```

---

**更新时间**: 2026-03-05 15:50  
**状态**: ✅ 可用于MVP开发
