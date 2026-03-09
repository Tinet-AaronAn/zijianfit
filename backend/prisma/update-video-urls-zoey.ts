/**
 * 视频映射表 - 周六野Zoey + 卓叔增重
 *
 * 策略：
 * 1. 优先使用周六野Zoey（初学者友好）
 * 2. 如果周六野没有，使用卓叔增重
 * 3. 如果都没有，使用凯圣王作为备选
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 视频映射表 - 请根据实际搜索结果填充BV号
const videoMapping: Record<string, { url: string; author: string; bvId: string; title: string }> = {
  // ===== 上肢力量 =====

  '哑铃对握卧推': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1uV41177iT', // 10分钟丰胸运动（包含卧推动作）
    title: '10分钟丰胸运动，练出胸中缝',
  },

  '哑铃俯身划船': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1GJ411x7hf', // 背部训练-哑铃划船
    title: '哑铃划船-背部训练王牌动作',
  },

  '哑铃站姿推举': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1WJ411s7vX', // 肩部训练
    title: '想要好体态必须常练肩背！',
  },

  '哑铃站姿弯举': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV17t411j7A1', // 手臂训练
    title: '哑铃版瘦手臂',
  },

  '哑铃夹胸': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1uV41177iT', // 与卧推同一视频，包含夹胸
    title: '10分钟丰胸运动（含夹胸）',
  },

  // ===== 下肢力量 =====

  '哑铃深蹲': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 臀腿训练
    title: '家庭臀腿训练',
  },

  '哑铃硬拉': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1vE411s7kK', // 硬拉教学
    title: '哑铃硬拉-后链训练',
  },

  '哑铃左弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 与深蹲同一视频，包含弓步
    title: '家庭臀腿训练（含弓步）',
  },

  '哑铃右弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1qJ411u7kG', // 与左弓步同一视频
    title: '家庭臀腿训练（含弓步）',
  },

  // ===== 腹部训练 =====

  '腹部踢腿': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1ME41197jt', // 腹部训练
    title: '马甲线速成训练',
  },
};

// 注意：以上BV号为示例，需要根据实际搜索结果更新
// 请在B站搜索对应关键词获取准确BV号

async function main() {
  console.log('🎬 开始更新视频链接...\n');
  console.log('⚠️  注意：当前使用的是示例BV号，请先验证并更新为实际BV号\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [exerciseName, videoInfo] of Object.entries(videoMapping)) {
    if (!videoInfo.bvId || videoInfo.bvId.includes('示例')) {
      console.log(`⚠️  ${exerciseName} - BV号待确认`);
      notFoundCount++;
      continue;
    }

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
      console.log(`✅ ${exerciseName} - ${videoInfo.author} - ${videoInfo.title}`);
      updatedCount += result.count;
    } else {
      console.log(`❌ ${exerciseName} - 未找到匹配的动作`);
      notFoundCount++;
    }
  }

  console.log('\n📊 更新统计：');
  console.log(`  - 成功更新：${updatedCount}个动作`);
  console.log(`  - 待确认：${notFoundCount}个动作`);

  if (notFoundCount > 0) {
    console.log('\n⚠️  提示：请搜索B站获取准确的BV号');
  }
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
