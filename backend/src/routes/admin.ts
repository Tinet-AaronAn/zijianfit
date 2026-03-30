import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import { ResponseUtil } from '../utils/response';

const router = new Router({
  prefix: '/api/admin',
});

/**
 * POST /api/admin/seed - 远程执行数据库 seed（导入训练计划）
 * 用途：服务器部署后，通过 HTTP 请求导入种子数据，无需 SSH 登录服务器
 * 
 * 调用方式：
 *   curl -X POST http://localhost:3001/api/admin/seed
 * 
 * 幂等操作：如果已有计划数据，会先清除再重新导入
 */
router.post('/seed', async (ctx) => {
  const prisma = new PrismaClient();
  try {
    console.log('🏋️ 开始导入训练计划数据...');

    // 检查是否已有计划，有则先清除（幂等）
    const existingPlan = await prisma.plan.findFirst({
      where: { year: 2026, weekNumber: 1 },
    });

    if (existingPlan) {
      await prisma.exercise.deleteMany({ where: { dayPlan: { planId: existingPlan.id } } });
      await prisma.dayPlan.deleteMany({ where: { planId: existingPlan.id } });
      await prisma.plan.delete({ where: { id: existingPlan.id } });
      console.log('🗑️ 已清除旧计划数据');
    }

    // 上肢力量动作（5个）
    const upperBodyExercises = [
      { name: '哑铃对握卧推', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 45, muscleGroup: 'chest', description: '对握握法卧推，强化胸肌中缝', order: 1 },
      { name: '哑铃俯身划船', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 45, muscleGroup: 'back', description: '俯身45度，背部发力，避免借力', order: 2 },
      { name: '哑铃站姿推举', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 45, muscleGroup: 'shoulders', description: '站姿推举，核心收紧，避免腰部借力', order: 3 },
      { name: '哑铃站姿弯举', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 45, muscleGroup: 'biceps', description: '站姿弯举，大臂夹紧，避免晃动', order: 4 },
      { name: '哑铃夹胸', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 45, muscleGroup: 'chest', description: '仰卧，手臂微弯，感受胸肌拉伸', order: 5 },
    ];

    // 下肢力量动作（4个）
    const lowerBodyExercises = [
      { name: '哑铃深蹲', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 60, muscleGroup: 'legs', description: '深蹲，膝盖不超过脚尖，臀部后坐', order: 1 },
      { name: '哑铃硬拉', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 60, muscleGroup: 'back', description: '硬拉，保持背部挺直，臀部发力', order: 2 },
      { name: '哑铃左弓步', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 60, muscleGroup: 'legs', description: '左腿弓步，膝盖不超过脚尖', order: 3 },
      { name: '哑铃右弓步', type: 'strength', sets: 3, reps: 15, duration: 0, weight: '6.5kg/只', restSeconds: 60, muscleGroup: 'legs', description: '右腿弓步，膝盖不超过脚尖', order: 4 },
    ];

    // 腹部训练（1个）
    const coreExercises = [
      { name: '腹部踢腿', type: 'strength', sets: 3, reps: 20, duration: 0, weight: '', restSeconds: 45, muscleGroup: 'core', description: '仰卧抬腿，下腹发力，腰部贴地', order: 1 },
    ];

    // 慢跑训练（3个阶段：热身5min + 稳态跑20min + 降速5min）
    const joggingExercises = [
      { name: '热身', type: 'cardio', sets: 1, reps: 1, duration: 300, weight: '', restSeconds: 0, muscleGroup: '', speed: '6 km/h', heartRate: '110-120', description: '逐渐提高心率，准备进入稳态跑', order: 1 },
      { name: '稳态慢跑', type: 'cardio', sets: 1, reps: 1, duration: 1200, weight: '', restSeconds: 0, muscleGroup: '', speed: '7.5-8 km/h', heartRate: '125-135', description: '保持稳定心率，有氧燃脂', order: 2 },
      { name: '降速', type: 'cardio', sets: 1, reps: 1, duration: 300, weight: '', restSeconds: 0, muscleGroup: '', speed: '5 km/h', heartRate: '100-110', description: '充分放松，逐渐降低心率', order: 3 },
    ];

    // 间歇有氧训练（3个阶段：热身5min + 间歇训练18min + 冷身7min）
    const hiitExercises = [
      { name: '热身', type: 'cardio', sets: 1, reps: 1, duration: 300, weight: '', restSeconds: 0, muscleGroup: '', speed: '快走/慢跑', heartRate: '110-120', description: '快走或慢跑，提高心率', order: 1 },
      { name: '间歇训练', type: 'hiit', sets: 6, reps: 1, duration: 180, weight: '', restSeconds: 0, muscleGroup: '', speed: '快跑9-10km/h，慢跑6km/h', heartRate: '140-150', pattern: '快跑1分钟 + 慢跑2分钟', description: '间歇跑，提高心肺功能', order: 2 },
      { name: '冷身', type: 'cardio', sets: 1, reps: 1, duration: 420, weight: '', restSeconds: 0, muscleGroup: '', speed: '慢走', heartRate: '逐渐降至100', description: '慢走放松，恢复心率', order: 3 },
    ];

    // 创建训练计划
    const plan = await prisma.plan.create({
      data: {
        name: '45岁健身计划（稳定版）',
        description: '目标：降血糖 + 降血脂 + 稳定增肌 | 哑铃重量：6.5kg | 力量训练：3组×15次 | 有氧：慢跑30分钟',
        targetAudience: '45岁中年人群，目标是降血糖、降血脂、稳定增肌',
        weekNumber: 1,
        year: 2026,
        isActive: true,
      },
    });
    console.log(`✅ 计划创建成功: ${plan.id}`);

    // 每日训练安排
    const dayPlans = [
      { dayOfWeek: 1, dayName: '周一', title: '上肢力量', description: '哑铃训练：3组×15次，组间休息45秒', isRestDay: false, totalDuration: 20, exercises: upperBodyExercises },
      { dayOfWeek: 2, dayName: '周二', title: '上肢力量 + 慢跑', description: '上肢力量20分钟 + 慢跑30分钟', isRestDay: false, totalDuration: 50, exercises: [...upperBodyExercises, ...joggingExercises] },
      { dayOfWeek: 3, dayName: '周三', title: '下肢力量', description: '哑铃训练：3组×15次，组间休息60秒', isRestDay: false, totalDuration: 20, exercises: lowerBodyExercises },
      { dayOfWeek: 4, dayName: '周四', title: '慢跑', description: '稳态慢跑30分钟，心率120-135', isRestDay: false, totalDuration: 30, exercises: joggingExercises },
      { dayOfWeek: 5, dayName: '周五', title: '上肢力量 + 慢跑', description: '上肢力量20分钟 + 慢跑30分钟', isRestDay: false, totalDuration: 50, exercises: [...upperBodyExercises, ...joggingExercises] },
      { dayOfWeek: 6, dayName: '周六', title: '下肢力量', description: '哑铃训练：3组×15次，组间休息60秒', isRestDay: false, totalDuration: 20, exercises: lowerBodyExercises },
      { dayOfWeek: 7, dayName: '周日', title: '间歇有氧 + 腹部训练', description: '间歇跑30分钟 + 腹部踢腿3组×20次', isRestDay: false, totalDuration: 40, exercises: [...hiitExercises, ...coreExercises] },
    ];

    let totalExercises = 0;
    for (const dayPlan of dayPlans) {
      const { exercises, ...dayData } = dayPlan;
      const createdDayPlan = await prisma.dayPlan.create({
        data: { ...dayData, planId: plan.id },
      });
      for (const exercise of exercises) {
        await prisma.exercise.create({
          data: { ...exercise, dayPlanId: createdDayPlan.id },
        });
      }
      totalExercises += exercises.length;
      console.log(`  ✅ ${dayPlan.dayName} - ${dayPlan.title} (${exercises.length}个动作)`);
    }

    console.log('\n🎉 训练计划导入完成！');

    ResponseUtil.success(ctx, {
      planId: plan.id,
      planName: plan.name,
      daysCreated: dayPlans.length,
      exercisesCreated: totalExercises,
    }, '训练计划导入完成');
  } catch (error: any) {
    console.error('❌ Seed失败:', error);
    ResponseUtil.internalError(ctx, '训练计划导入失败: ' + error.message);
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
