/**
 * 清空旧计划并导入新计划
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  清空旧训练计划...\n');

  // 删除所有旧数据
  const deletedProgress = await prisma.progress.deleteMany();
  console.log(`  删除进度记录: ${deletedProgress.count}条`);

  const deletedExercises = await prisma.exercise.deleteMany();
  console.log(`  删除动作: ${deletedExercises.count}条`);

  const deletedDayPlans = await prisma.dayPlan.deleteMany();
  console.log(`  删除每日计划: ${deletedDayPlans.count}条`);

  const deletedPlans = await prisma.plan.deleteMany();
  console.log(`  删除训练计划: ${deletedPlans.count}条`);

  console.log('\n✅ 旧数据已清空\n');
  console.log('📝 请运行 seed-new-plan.ts 导入新计划');
}

main()
  .catch((e) => {
    console.error('❌ 清空失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
