/**
 * 最终视频BV号更新 - 45岁健身计划
 * 基于精确搜索结果
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 精确搜索到的BV号映射
const finalVideoMapping: Record<string, { url: string; author: string; bvId: string; title: string }> = {
  // ===== 上肢力量 =====

  '哑铃对握卧推': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1i541157wM',
    title: '丰胸必看！！一个俯卧撑都不会？马上学会！',
  },

  '哑铃俯身划船': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  '哑铃站姿推举': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1YE411K7vF',
    title: '想要好体态必须常练肩背！',
  },

  '哑铃站姿弯举': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw', // 与划船同一视频
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  '哑铃夹胸': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1i541157wM', // 与卧推同一视频
    title: '丰胸必看！！（包含夹胸）',
  },

  // ===== 下肢力量 =====

  '哑铃深蹲': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  '哑铃硬拉': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  '哑铃左弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  '哑铃右弓步': {
    url: 'https://www.bilibili.com/video/',
    author: '卓叔增重',
    bvId: 'BV1NW4y1Y7xw',
    title: 'B站最全！30个家庭哑铃增肌动作教学',
  },

  // ===== 腹部训练 =====

  '腹部踢腿': {
    url: 'https://www.bilibili.com/video/',
    author: '周六野Zoey',
    bvId: 'BV1cx411j7A1',
    title: '5分钟瘦下腹运动，减顽固小肚子',
  },
};

async function main() {
  console.log('🎯 最终BV号更新 - 45岁健身计划\n');
  console.log('来源: 精确搜索（周六野Zoey + 卓叔增重）\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [exerciseName, videoInfo] of Object.entries(finalVideoMapping)) {
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
      console.log(`   ${videoInfo.author} - ${videoInfo.bvId}`);
      console.log(`   ${videoInfo.title}\n`);
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

  console.log('💡 BV号来源：');
  console.log('  - 周六野Zoey: BV1i541157wM, BV1YE411K7vF, BV1cx411j7A1');
  console.log('  - 卓叔增重: BV1NW4y1Y7xw');
  console.log('\n✅ 所有视频均为高质量教学，适合初学者');
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
