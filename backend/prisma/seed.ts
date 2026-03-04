import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExerciseData {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: string;
  restSeconds?: number;
  videoUrl?: string;
  description?: string;
  muscleGroup?: string;
  speed?: string;
  heartRate?: string;
  pattern?: string;
}

interface SectionData {
  type: string;
  name: string;
  duration: number;
  exercises: ExerciseData[];
  rounds?: number;
  roundDuration?: number;
  restBetweenRounds?: number;
}

interface DayData {
  dayOfWeek: number;
  dayName: string;
  isRestDay: boolean;
  title: string;
  description?: string;
  totalDuration?: number;
  sections?: SectionData[];
}

interface PlanData {
  planName: string;
  targetAudience: string;
  weeklyDuration: string;
  description: string;
  days: DayData[];
  keyReminders: string[];
}

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 读取训练计划 JSON
  const planPath = path.join(__dirname, '../data/seed-plan-45.json');
  const planData: PlanData = JSON.parse(fs.readFileSync(planPath, 'utf-8'));

  console.log(`📋 加载训练计划: ${planData.planName}`);

  // 创建训练计划
  const plan = await prisma.plan.create({
    data: {
      name: planData.planName,
      description: planData.description,
      targetAudience: planData.targetAudience,
      weekNumber: 1,
      year: new Date().getFullYear(),
      isActive: true,
    },
  });

  console.log(`✅ 创建训练计划: ID ${plan.id}`);

  // 创建每日计划
  for (const dayData of planData.days) {
    const dayPlan = await prisma.dayPlan.create({
      data: {
        planId: plan.id,
        dayOfWeek: dayData.dayOfWeek,
        dayName: dayData.dayName,
        isRestDay: dayData.isRestDay,
        title: dayData.title,
        description: dayData.description || '',
        totalDuration: dayData.totalDuration || 0,
      },
    });

    console.log(`  ✅ 创建 ${dayData.dayName}: ${dayData.title}`);

    // 如果不是休息日，创建动作
    if (!dayData.isRestDay && dayData.sections) {
      let exerciseOrder = 1;

      for (const section of dayData.sections) {
        for (const exerciseData of section.exercises) {
          const exercise = await prisma.exercise.create({
            data: {
              dayPlanId: dayPlan.id,
              name: exerciseData.name,
              type: section.type as any,
              sets: exerciseData.sets || 1,
              reps: exerciseData.reps || 1,
              duration: exerciseData.duration || 0,
              weight: exerciseData.weight || '',
              restSeconds: exerciseData.restSeconds || 0,
              videoUrl: exerciseData.videoUrl || '',
              description: exerciseData.description || '',
              muscleGroup: exerciseData.muscleGroup || '',
              speed: exerciseData.speed || '',
              heartRate: exerciseData.heartRate || '',
              pattern: exerciseData.pattern || '',
              order: exerciseOrder,
            },
          });

          console.log(`    ✅ 创建动作: ${exerciseData.name}`);
          exerciseOrder++;
        }
      }
    }
  }

  console.log('🎉 数据库初始化完成！');
  console.log(`📊 统计:`);
  console.log(`   - 训练计划: 1`);
  console.log(`   - 训练天数: ${planData.days.length}`);
  console.log(`   - 休息天数: ${planData.days.filter(d => d.isRestDay).length}`);
  console.log(`   - 训练天数: ${planData.days.filter(d => !d.isRestDay).length}`);
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
