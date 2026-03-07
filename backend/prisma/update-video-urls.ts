/**
 * 批量更新训练视频链接
 * 使用方式：ts-node update-video-urls.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 视频映射表 - 请根据 VIDEO_RECOMMENDATIONS.md 填充
const videoMapping: Record<string, { url: string; author: string; bvId?: string }> = {
  // 上肢力量
  '哑铃对握卧推': {
    url: 'https://www.bilibili.com/video/', // 填入BV号
    author: '跟练健身Online',
    bvId: '', // BV号
  },
  '哑铃俯身划船': {
    url: 'https://www.bilibili.com/video/',
    author: '凯圣王',
    bvId: '',
  },
  '哑铃站姿推举': {
    url: 'https://www.bilibili.com/video/',
    author: 'FitEmpire健身领域',
    bvId: '',
  },
  '哑铃站姿弯举': {
    url: 'https://www.bilibili.com/video/',
    author: '凯圣王',
    bvId: '',
  },
  '哑铃夹胸': {
    url: 'https://www.bilibili.com/video/',
    author: 'FitEmpire健身领域',
    bvId: '',
  },

  // 下肢力量
  '哑铃深蹲': {
    url: 'https://www.bilibili.com/video/',
    author: '凯圣王',
    bvId: '',
  },
  '哑铃硬拉': {
    url: 'https://www.bilibili.com/video/',
    author: 'FitEmpire健身领域',
    bvId: '',
  },
  '哑铃左弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: '',
  },
  '哑铃右弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: '',
  },

  // 腹部训练
  '腹部踢腿': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: '',
  },
};

async function main() {
  console.log('🎬 开始更新视频链接...\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [exerciseName, videoInfo] of Object.entries(videoMapping)) {
    if (!videoInfo.bvId) {
      console.log(`⚠️  ${exerciseName} - 未提供BV号，跳过`);
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
      console.log(`✅ ${exerciseName} - 已更新 (${result.count}个)`);
      updatedCount += result.count;
    } else {
      console.log(`❌ ${exerciseName} - 未找到匹配的动作`);
      notFoundCount++;
    }
  }

  console.log('\n📊 更新统计：');
  console.log(`  - 成功更新：${updatedCount}个动作`);
  console.log(`  - 未更新：${notFoundCount}个动作`);

  if (notFoundCount > 0) {
    console.log('\n⚠️  提示：请先填充 videoMapping 中的 BV 号');
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
