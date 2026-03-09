/**
 * 45岁健身计划（稳定版）- 数据填充脚本
 * 目标：降血糖 + 降血脂 + 稳定增肌
 * 哑铃重量：6.5kg
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 新训练计划数据
const newPlan = {
  name: '45岁健身计划（稳定版）',
  description: '目标：降血糖 + 降血脂 + 稳定增肌 | 哑铃重量：6.5kg | 力量训练：3组×15次 | 有氧：慢跑30分钟',
  targetAudience: '45岁中年人群，目标是降血糖、降血脂、稳定增肌',
  weekNumber: 1, // 第一周
  year: 2026,
};

// 上肢力量训练动作
const upperBodyExercises = [
  {
    name: '哑铃对握卧推',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 45,
    muscleGroup: 'chest',
    description: '对握握法卧推，强化胸肌中缝',
    order: 1,
    videoUrl: '', // 待填充
    videoSource: 'bilibili',
    videoAuthor: '', // 待填充
  },
  {
    name: '哑铃俯身划船',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 45,
    muscleGroup: 'back',
    description: '俯身45度，背部发力，避免借力',
    order: 2,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃站姿推举',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 45,
    muscleGroup: 'shoulders',
    description: '站姿推举，核心收紧，避免腰部借力',
    order: 3,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃站姿弯举',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 45,
    muscleGroup: 'biceps',
    description: '站姿弯举，大臂夹紧，避免晃动',
    order: 4,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃夹胸',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 45,
    muscleGroup: 'chest',
    description: '仰卧，手臂微弯，感受胸肌拉伸',
    order: 5,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
];

// 下肢力量训练动作
const lowerBodyExercises = [
  {
    name: '哑铃深蹲',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 60,
    muscleGroup: 'legs',
    description: '深蹲，膝盖不超过脚尖，臀部后坐',
    order: 1,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃硬拉',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 60,
    muscleGroup: 'back',
    description: '硬拉，保持背部挺直，臀部发力',
    order: 2,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃左弓步',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 60,
    muscleGroup: 'legs',
    description: '左腿弓步，膝盖不超过脚尖',
    order: 3,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
  {
    name: '哑铃右弓步',
    type: 'strength',
    sets: 3,
    reps: 15,
    duration: 0,
    weight: '6.5kg/只',
    restSeconds: 60,
    muscleGroup: 'legs',
    description: '右腿弓步，膝盖不超过脚尖',
    order: 4,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
];

// 腹部训练动作
const coreExercises = [
  {
    name: '腹部踢腿',
    type: 'strength',
    sets: 3,
    reps: 20,
    duration: 0,
    weight: '',
    restSeconds: 45,
    muscleGroup: 'core',
    description: '仰卧抬腿，下腹发力，腰部贴地',
    order: 1,
    videoUrl: '',
    videoSource: 'bilibili',
    videoAuthor: '',
  },
];

// 慢跑训练（3个阶段）
const joggingExercises = [
  {
    name: '热身',
    type: 'cardio',
    sets: 1,
    reps: 1,
    duration: 300, // 5分钟
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '6 km/h',
    heartRate: '110-120',
    description: '逐渐提高心率，准备进入稳态跑',
    order: 1,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
  {
    name: '稳态慢跑',
    type: 'cardio',
    sets: 1,
    reps: 1,
    duration: 1200, // 20分钟
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '7.5-8 km/h',
    heartRate: '125-135',
    description: '保持稳定心率，有氧燃脂',
    order: 2,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
  {
    name: '降速',
    type: 'cardio',
    sets: 1,
    reps: 1,
    duration: 300, // 5分钟
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '5 km/h',
    heartRate: '100-110',
    description: '充分放松，逐渐降低心率',
    order: 3,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
];

// 间歇有氧训练
const hiitExercises = [
  {
    name: '热身',
    type: 'cardio',
    sets: 1,
    reps: 1,
    duration: 300, // 5分钟
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '快走/慢跑',
    heartRate: '110-120',
    description: '快走或慢跑，提高心率',
    order: 1,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
  {
    name: '间歇训练',
    type: 'hiit',
    sets: 6,
    reps: 1,
    duration: 180, // 3分钟/组（快跑1分钟 + 慢跑2分钟）
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '快跑9-10km/h，慢跑6km/h',
    heartRate: '140-150',
    pattern: '快跑1分钟 + 慢跑2分钟',
    description: '间歇跑，提高心肺功能',
    order: 2,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
  {
    name: '冷身',
    type: 'cardio',
    sets: 1,
    reps: 1,
    duration: 420, // 7分钟
    weight: '',
    restSeconds: 0,
    muscleGroup: '',
    speed: '慢走',
    heartRate: '逐渐降至100',
    description: '慢走放松，恢复心率',
    order: 3,
    videoUrl: '',
    videoSource: '',
    videoAuthor: '',
  },
];

// 每日训练安排
const dayPlans = [
  {
    dayOfWeek: 1,
    dayName: '周一',
    title: '上肢力量',
    description: '哑铃训练：3组×15次，组间休息45秒',
    isRestDay: false,
    totalDuration: 20,
    exercises: upperBodyExercises,
  },
  {
    dayOfWeek: 2,
    dayName: '周二',
    title: '上肢力量 + 慢跑',
    description: '上肢力量20分钟 + 慢跑30分钟',
    isRestDay: false,
    totalDuration: 50,
    exercises: [...upperBodyExercises, ...joggingExercises],
  },
  {
    dayOfWeek: 3,
    dayName: '周三',
    title: '下肢力量',
    description: '哑铃训练：3组×15次，组间休息60秒',
    isRestDay: false,
    totalDuration: 20,
    exercises: lowerBodyExercises,
  },
  {
    dayOfWeek: 4,
    dayName: '周四',
    title: '慢跑',
    description: '稳态慢跑30分钟，心率120-135',
    isRestDay: false,
    totalDuration: 30,
    exercises: joggingExercises,
  },
  {
    dayOfWeek: 5,
    dayName: '周五',
    title: '上肢力量 + 慢跑',
    description: '上肢力量20分钟 + 慢跑30分钟',
    isRestDay: false,
    totalDuration: 50,
    exercises: [...upperBodyExercises, ...joggingExercises],
  },
  {
    dayOfWeek: 6,
    dayName: '周六',
    title: '下肢力量',
    description: '哑铃训练：3组×15次，组间休息60秒',
    isRestDay: false,
    totalDuration: 20,
    exercises: lowerBodyExercises,
  },
  {
    dayOfWeek: 7,
    dayName: '周日',
    title: '间歇有氧 + 腹部训练',
    description: '间歇跑30分钟 + 腹部踢腿3组×20次',
    isRestDay: false,
    totalDuration: 40,
    exercises: [...hiitExercises, ...coreExercises],
  },
];

async function main() {
  console.log('🏋️ 开始导入45岁健身计划...\n');

  // 1. 创建新计划
  console.log('📋 创建训练计划...');
  const plan = await prisma.plan.create({
    data: {
      name: newPlan.name,
      description: newPlan.description,
      targetAudience: newPlan.targetAudience,
      weekNumber: newPlan.weekNumber,
      year: newPlan.year,
      isActive: true,
    },
  });
  console.log(`✅ 计划创建成功: ${plan.id}\n`);

  // 2. 创建每日训练
  console.log('📅 创建每日训练...');
  for (const dayPlan of dayPlans) {
    const { exercises, ...dayData } = dayPlan;
    
    const createdDayPlan = await prisma.dayPlan.create({
      data: {
        ...dayData,
        planId: plan.id,
      },
    });

    // 3. 创建动作
    for (const exercise of exercises) {
      await prisma.exercise.create({
        data: {
          ...exercise,
          dayPlanId: createdDayPlan.id,
        },
      });
    }

    console.log(`  ✅ ${dayPlan.dayName} - ${dayPlan.title} (${exercises.length}个动作)`);
  }

  console.log('\n🎉 训练计划导入完成！');
  console.log('\n📊 训练统计：');
  console.log('  - 上肢力量：3次/周');
  console.log('  - 下肢力量：2次/周');
  console.log('  - 慢跑：3次/周（共90分钟）');
  console.log('  - 间歇有氧：1次/周（30分钟）');
  console.log('  - 每周总时长：约180分钟');
  console.log('\n⚠️  注意：视频链接尚未填充，请使用 update-video-urls.ts 更新');
}

main()
  .catch((e) => {
    console.error('❌ 导入失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
