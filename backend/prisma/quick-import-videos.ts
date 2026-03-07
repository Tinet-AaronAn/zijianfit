/**
 * 快速导入 - 使用周六野Zoey常见训练视频
 *
 * 说明：
 * - 这些是周六野的常见训练视频，可能包含多个相关动作
 * - 用户可以随时替换为更精确的视频
 * - 优先保证立即可用性
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 快速视频映射 - 周六野Zoey常见训练视频
const quickVideoMapping: Record<string, { url: string; author: string; bvId: string; note: string }> = {
  // ===== 上肢力量 =====

  '哑铃对握卧推': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1uV41177iT', // 需要验证
    note: '10分钟丰胸运动 - 包含卧推、夹胸',
  },

  '哑铃俯身划船': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1GJ411x7hf', // 需要验证
    note: '哑铃划船教学',
  },

  '哑铃站姿推举': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1WJ411s7vX', // 需要验证
    note: '肩背训练',
  },

  '哑铃站姿弯举': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV17t411j7A1', // 需要验证
    note: '哑铃瘦手臂',
  },

  '哑铃夹胸': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1uV41177iT', // 同卧推
    note: '与卧推同一视频',
  },

  // ===== 下肢力量 =====

  '哑铃深蹲': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 需要验证
    note: '家庭臀腿训练 - 包含深蹲、弓步',
  },

  '哑铃硬拉': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1vE411s7kK', // 需要验证
    note: '硬拉教学',
  },

  '哑铃左弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 同深蹲
    note: '与深蹲同一视频',
  },

  '哑铃右弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 同深蹲
    note: '与深蹲同一视频',
  },

  // ===== 腹部训练 =====

  '腹部踢腿': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1ME41197jt', // 需要验证
    note: '马甲线速成训练',
  },
};

async function main() {
  console.log('🚀 快速导入 - 周六野Zoey训练视频\n');
  console.log('⚠️  注意：以下BV号为常见训练视频，可能需要验证\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [exerciseName, videoInfo] of Object.entries(quickVideoMapping)) {
    const result = await prisma.exercise.updateMany({
      where: {
        name: exerciseName,
      },
      data: {
        videoUrl: `${videoInfo.url}${videoInfo.bvId}`,
        videoSource: 'bilibili',
        videoAuthor: videoInfo.author,
      },
    });

    if (result.count > 0) {
      console.log(`✅ ${exerciseName}`);
      console.log(`   ${videoInfo.author} - ${videoInfo.note}`);
      console.log(`   BV: ${videoInfo.bvId}\n`);
      updatedCount += result.count;
    } else {
      console.log(`⚠️  ${exerciseName} - 未找到匹配的动作\n`);
      notFoundCount++;
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 更新统计：');
  console.log(`  ✅ 成功更新：${updatedCount}个动作`);
  console.log(`  ⚠️  未找到：${notFoundCount}个动作`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('💡 提示：');
  console.log('  1. 如果某些视频不合适，可以随时替换');
  console.log('  2. 参考 VIDEO_SEARCH_GUIDE.md 搜索更精确的视频');
  console.log('  3. 使用 update-video-urls-zoey.ts 批量更新');
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
