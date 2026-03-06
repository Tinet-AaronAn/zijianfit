import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';
import { ResponseUtil } from '../utils/response';

const prisma = new PrismaClient();

/**
 * 获取当前周计划
 * GET /api/plans/current
 */
export async function getCurrentPlan(ctx: Context) {
  try {
    // 获取当前周
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysDiff = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);
    const year = now.getFullYear();

    // 查询当前计划
    const plan = await prisma.plan.findFirst({
      where: {
        weekNumber,
        year,
        isActive: true,
      },
      include: {
        dayPlans: {
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!plan) {
      // 如果没有找到当前周计划，返回第一个可用计划
      const firstPlan = await prisma.plan.findFirst({
        where: { isActive: true },
        include: {
          dayPlans: {
            include: {
              exercises: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { dayOfWeek: 'asc' },
          },
        },
      });

      if (!firstPlan) {
        ResponseUtil.notFound(ctx, '未找到任何训练计划');
        return;
      }

      // 使用第一个计划
      const days = firstPlan.dayPlans.map((dayPlan) => {
        const dayDate = new Date(now);
        dayDate.setDate(dayDate.getDate() - dayDate.getDay() + dayPlan.dayOfWeek);

        return {
          id: dayPlan.id,  // 添加 DayPlan 的 ID
          planId: dayPlan.planId,  // 添加所属计划的 ID
          dayOfWeek: dayPlan.dayOfWeek,
          date: dayDate.toISOString().split('T')[0],
          isRestDay: dayPlan.isRestDay,
          title: dayPlan.title,
          label: dayPlan.isRestDay ? '休息' : `${dayPlan.exercises.length} 个动作`,
          exerciseCount: dayPlan.exercises.length,
        };
      });

      ResponseUtil.success(ctx, {
        id: firstPlan.id,
        weekNumber: firstPlan.weekNumber,
        year: firstPlan.year,
        days,
      });
      return;
    }

    // 格式化响应数据
    const days = plan.dayPlans.map((dayPlan) => {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() - dayDate.getDay() + dayPlan.dayOfWeek);

      return {
        id: dayPlan.id,  // 添加 DayPlan 的 ID
        planId: dayPlan.planId,  // 添加所属计划的 ID
        dayOfWeek: dayPlan.dayOfWeek,
        date: dayDate.toISOString().split('T')[0],
        isRestDay: dayPlan.isRestDay,
        title: dayPlan.title,
        label: dayPlan.isRestDay ? '休息' : `${dayPlan.exercises.length} 个动作`,
        exerciseCount: dayPlan.exercises.length,
      };
    });

    ResponseUtil.success(ctx, {
      id: plan.id,
      weekNumber: plan.weekNumber,
      year: plan.year,
      days,
    });
  } catch (error: any) {
    console.error('获取当前计划错误:', error);
    ResponseUtil.internalError(ctx, '获取当前计划失败');
  }
}

/**
 * 获取某日训练详情
 * GET /api/plans/:planId/days/:dayOfWeek
 */
export async function getDayPlan(ctx: Context) {
  const { planId, dayOfWeek } = ctx.params;
  const dayOfWeekNum = parseInt(dayOfWeek, 10);

  if (isNaN(dayOfWeekNum) || dayOfWeekNum < 1 || dayOfWeekNum > 7) {
    ResponseUtil.invalidParams(ctx, 'dayOfWeek 参数错误，应为 1-7');
    return;
  }

  try {
    // 查询日计划
    const dayPlan = await prisma.dayPlan.findFirst({
      where: {
        planId,
        dayOfWeek: dayOfWeekNum,
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!dayPlan) {
      ResponseUtil.notFound(ctx, '未找到该日计划');
      return;
    }

    // 计算日期
    const now = new Date();
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() - dayDate.getDay() + dayOfWeekNum);

    // 格式化动作数据
    const exercises = dayPlan.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      type: exercise.type,
      sets: exercise.sets,
      reps: exercise.reps,
      duration: exercise.duration,
      weight: exercise.weight,
      restSeconds: exercise.restSeconds,
      videoUrl: exercise.videoUrl,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      speed: exercise.speed,
      heartRate: exercise.heartRate,
      pattern: exercise.pattern,
    }));

    ResponseUtil.success(ctx, {
      dayOfWeek: dayPlan.dayOfWeek,
      dayName: dayPlan.dayName,
      date: dayDate.toISOString().split('T')[0],
      isRestDay: dayPlan.isRestDay,
      title: dayPlan.title,
      totalDuration: dayPlan.totalDuration,
      exercises: dayPlan.isRestDay ? [] : exercises,
    });
  } catch (error: any) {
    console.error('获取日计划错误:', error);
    ResponseUtil.internalError(ctx, '获取日计划失败');
  }
}

/**
 * 获取计划详情
 * GET /api/plans/:planId
 */
export async function getPlanById(ctx: Context) {
  const { planId } = ctx.params;

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        dayPlans: {
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!plan) {
      ResponseUtil.notFound(ctx, '计划不存在');
      return;
    }

    ResponseUtil.success(ctx, plan);
  } catch (error: any) {
    console.error('获取计划详情错误:', error);
    ResponseUtil.internalError(ctx, '获取计划详情失败');
  }
}
