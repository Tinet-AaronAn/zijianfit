/**
 * 更新视频URL为新的本地文件
 * upper-body.mp4 - 上肢力量训练
 * lower-body.mp4 - 下肢力量训练
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 训练类型到视频的映射
const workoutVideoMap: Record<string, string> = {
  'upper-body': '/videos/upper-body.mp4',
  'lower-body': '/videos/lower-body.mp4',
};

// 根据训练类型分组动作
const exerciseTypeMap: Record<string, string> = {
  // 上肢力量
  '哑铃对握卧推': 'upper-body',
  '哑铃俯身划船': 'upper-body',
  '哑铃站姿推举': 'upper-body',
  '哑铃站姿弯举': 'upper-body',
  '哑铃夹胸': 'upper-body',
  
  // 下肢力量
  '哑铃深蹲': 'lower-body',
  '哑铃硬拉': 'lower-body',
  '哑铃左弓步': 'lower-body',
  '哑铃右弓步': 'lower-body',
  '腹部踢腿': 'lower-body',
  
  // 有氧运动（不需要视频）
  '热身过渡': 'cardio',
  '稳态慢跑': 'cardio',
  '缓慢降速': 'cardio',
  '间歇组': 'cardio',
};

async function main() {
  console.log('🎯 更新视频URL为跟练模式\n');
  console.log('训练模式说明：');
  console.log('  - upper-body: 跟着视频做上肢训练');
  console.log('  - lower-body: 跟着视频做下肢训练');
  console.log('  - cardio: 跑步，完成后点击打卡\n');

  let updatedCount = 0;
  let cardioCount = 0;

  for (const [exerciseName, type] of Object.entries(exerciseTypeMap)) {
    if (type === 'cardio') {
      // 有氧运动，清空视频URL
      const result = await prisma.exercise.updateMany({
        where: { name: exerciseName },
        data: {
          videoUrl: '',
          videoSource: 'none',
        },
      });
      if (result.count > 0) {
        console.log(`🏃 ${exerciseName} - 有氧训练（无需视频）`);
        cardioCount += result.count;
      }
    } else {
      // 力量训练，更新视频URL
      const videoPath = workoutVideoMap[type];
      const result = await prisma.exercise.updateMany({
        where: { name: exerciseName },
        data: {
          videoUrl: videoPath,
          videoSource: 'local',
        },
      });
      if (result.count > 0) {
        console.log(`💪 ${exerciseName} -> ${type}`);
        updatedCount += result.count;
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 更新统计：');
  console.log(`  💪 力量训练（有视频）: ${updatedCount}个动作`);
  console.log(`  🏃 有氧训练（无视频）: ${cardioCount}个动作`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('✅ 所有动作已按训练类型分配');
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
