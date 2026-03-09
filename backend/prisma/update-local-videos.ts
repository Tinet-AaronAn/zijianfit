/**
 * 更新视频URL为本地地址
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// BV号到本地视频文件的映射
const videoMapping: Record<string, string> = {
  // 哑铃对握卧推/夹胸
  'BV1i541157wM': '/videos/BV1i541157wM.mp4',
  // 卓叔30个哑铃动作（划船/弯举/深蹲/弓步/硬拉）
  'BV1NW4y1Y7xw': '/videos/BV1NW4y1Y7xw.mp4',
  // 哑铃站姿推举
  'BV1YE411K7vF': '/videos/BV1YE411K7vF.mp4',
  // 8分钟腹肌锻炼（替代腹部踢腿）
  'BV1ys41147mV': '/videos/BV1ys41147mV.mp4',
};

// 动作到视频的映射
const exerciseVideoMap: Record<string, string> = {
  '哑铃对握卧推': 'BV1i541157wM',
  '哑铃夹胸': 'BV1i541157wM',
  '哑铃俯身划船': 'BV1NW4y1Y7xw',
  '哑铃站姿弯举': 'BV1NW4y1Y7xw',
  '哑铃深蹲': 'BV1NW4y1Y7xw',
  '哑铃硬拉': 'BV1NW4y1Y7xw',
  '哑铃左弓步': 'BV1NW4y1Y7xw',
  '哑铃右弓步': 'BV1NW4y1Y7xw',
  '哑铃站姿推举': 'BV1YE411K7vF',
  '腹部踢腿': 'BV1ys41147mV', // 8分钟腹肌锻炼（替代视频）
};

async function main() {
  console.log('🎯 更新视频URL为本地地址\n');

  let updatedCount = 0;

  for (const [exerciseName, bvId] of Object.entries(exerciseVideoMap)) {
    const localPath = videoMapping[bvId];
    
    const result = await prisma.exercise.updateMany({
      where: { name: exerciseName },
      data: {
        videoUrl: localPath,
        videoSource: 'local',
      },
    });

    if (result.count > 0) {
      console.log(`✅ ${exerciseName} -> ${localPath}`);
      updatedCount += result.count;
    } else {
      console.log(`⚠️  ${exerciseName} - 未找到`);
    }
  }

  console.log(`\n📊 更新完成: ${updatedCount} 个动作`);
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
