/**
 * 测试数据库辅助函数
 */

import { PrismaClient, User, Plan, DayPlan, Exercise, Progress } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../setup'; // 使用全局 Prisma 客户端

// 不再创建新的 Prisma 客户端实例
// const prisma = new PrismaClient();

/**
 * 创建测试用户
 */
export async function createTestUser(overrides: Partial<User> = {}): Promise<User> {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  
  // 默认密码
  const defaultPassword = 'Test123456';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
  return prisma.user.create({
    data: {
      username: `testuser_${timestamp}_${randomSuffix}`,
      password: hashedPassword,
      openid: `test_openid_${timestamp}_${randomSuffix}`,
      phone: `138${timestamp.toString().slice(-8)}`,
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.png',
      ...overrides,
    },
  });
}

/**
 * 创建测试计划
 */
export async function createTestPlan(
  userId: string,
  overrides: Partial<Plan> = {}
): Promise<Plan> {
  const filteredOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([_, v]) => v !== undefined)
  );
  
  return prisma.plan.create({
    data: {
      userId,
      name: '测试计划',
      description: '这是一个测试计划',
      targetAudience: '测试用户',
      weekNumber: 1,
      year: 2026,
      ...filteredOverrides,
    },
  });
}

/**
 * 创建测试日计划
 */
export async function createTestDayPlan(
  planId: string,
  dayOfWeek: number,
  overrides: Partial<DayPlan> = {}
): Promise<DayPlan> {
  const filteredOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([_, v]) => v !== undefined)
  );
  
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  return prisma.dayPlan.create({
    data: {
      planId,
      dayOfWeek,
      dayName: dayNames[dayOfWeek - 1] || '周一',
      isRestDay: false,
      title: '测试训练',
      description: '',
      totalDuration: 60,
      ...filteredOverrides,
    },
  });
}

/**
 * 创建测试动作
 */
export async function createTestExercise(
  dayPlanId: string,
  order: number,
  overrides: Partial<Exercise> = {}
): Promise<Exercise> {
  const filteredOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([_, v]) => v !== undefined)
  );
  
  return prisma.exercise.create({
    data: {
      dayPlanId,
      name: `测试动作 ${order}`,
      type: 'strength',
      sets: 3,
      reps: 12,
      restSeconds: 60,
      videoUrl: 'https://example.com/video.mp4',
      order,
      ...filteredOverrides,
    },
  });
}

/**
 * 创建完整的测试计划（含日计划和动作）
 */
export async function createFullTestPlan(userId: string) {
  // 使用时间戳确保唯一性
  const timestamp = Date.now();
  const plan = await createTestPlan(userId, {
    weekNumber: Math.floor(timestamp / 1000) % 52 + 1, // 确保在 1-52 之间
    year: 2026
  });
  
  if (!plan || !plan.id) {
    throw new Error('创建测试计划失败');
  }
  
  // 等待一下确保 Plan 已经创建
  await new Promise(resolve => setTimeout(resolve, 10));
  
  // 创建 7 天计划
  const dayPlans = [];
  for (let i = 1; i <= 7; i++) {
    try {
      const isRestDay = i === 2 || i === 4 || i === 6; // 周二、四、六休息
      const dayPlan = await createTestDayPlan(plan.id, i, { isRestDay });
      
      if (!isRestDay && dayPlan && dayPlan.id) {
        // 训练日添加动作
        await createTestExercise(dayPlan.id, 1, { name: '哑铃推举' });
        await createTestExercise(dayPlan.id, 2, { name: '哑铃飞鸟' });
      }
      
      if (dayPlan) {
        dayPlans.push(dayPlan);
      }
    } catch (error) {
      console.error(`创建第 ${i} 天计划失败:`, error);
      // 继续创建其他天
    }
  }
  
  return { plan, dayPlans };
}

/**
 * 清理所有测试数据
 */
export async function cleanupTestData() {
  await prisma.progress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.dayPlan.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * 生成测试 JWT Token
 */
export function generateTestToken(userId: string): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: userId, openid: 'test_openid' },
    process.env.JWT_SECRET || 'test_jwt_secret_key',
    { expiresIn: '1h' }
  );
}

// 导出 prisma 供直接使用
export { prisma };
