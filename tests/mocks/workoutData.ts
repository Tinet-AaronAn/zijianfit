/**
 * Mock 训练数据
 */

// 训练计划
export interface MockPlan {
  id: string;
  userId: string;
  weekNumber: number;
  year: number;
  createdAt: string;
}

// 日计划
export interface MockDayPlan {
  id: string;
  planId: string;
  dayOfWeek: number;
  isRestDay: boolean;
}

// 动作
export interface MockExercise {
  id: string;
  dayPlanId: string;
  name: string;
  type: 'strength' | 'cardio';
  sets: number;
  reps: number;
  duration: number; // 分钟
  weight: string;
  restSeconds: number;
  videoUrl: string;
  description: string;
  muscleGroup: string;
  order: number;
}

// 训练进度
export interface MockProgress {
  id: string;
  userId: string;
  planId: string;
  date: string;
  completedExercises: string[];
  completedSets: Record<string, number>;
  isCompleted: boolean;
  createdAt: string;
}

// 标准动作库
export const exerciseLibrary = {
  // 肩部
  dumbbellPress: {
    name: '哑铃推举',
    muscleGroup: 'shoulders',
    type: 'strength' as const,
  },
  lateralRaise: {
    name: '哑铃侧平举',
    muscleGroup: 'shoulders',
    type: 'strength' as const,
  },
  
  // 背部
  pullDown: {
    name: '高位下拉',
    muscleGroup: 'back',
    type: 'strength' as const,
  },
  seatedRow: {
    name: '坐姿划船',
    muscleGroup: 'back',
    type: 'strength' as const,
  },
  
  // 胸部
  dumbbellFly: {
    name: '哑铃飞鸟',
    muscleGroup: 'chest',
    type: 'strength' as const,
  },
  
  // 腿部
  squat: {
    name: '深蹲',
    muscleGroup: 'legs',
    type: 'strength' as const,
  },
  lunge: {
    name: '弓步蹲',
    muscleGroup: 'legs',
    type: 'strength' as const,
  },
  
  // 核心
  plank: {
    name: '平板支撑',
    muscleGroup: 'core',
    type: 'strength' as const,
  },
  
  // 有氧
  running: {
    name: '跑步',
    muscleGroup: 'cardio',
    type: 'cardio' as const,
  },
};

// Mock 完整训练计划
export const mockFullPlan: MockPlan = {
  id: 'plan-full-001',
  userId: 'user-existing-001',
  weekNumber: 1,
  year: 2026,
  createdAt: '2026-03-01T00:00:00Z',
};

// Mock 训练日动作列表
export const mockTrainingDayExercises: MockExercise[] = [
  {
    id: 'ex-001',
    dayPlanId: 'day-001',
    name: '哑铃推举',
    type: 'strength',
    sets: 2,
    reps: 12,
    duration: 0,
    weight: '10-12kg/只',
    restSeconds: 60,
    videoUrl: 'https://example.com/video/dumbbell-press.mp4',
    description: '肩部训练，站姿或坐姿',
    muscleGroup: 'shoulders',
    order: 1,
  },
  {
    id: 'ex-002',
    dayPlanId: 'day-001',
    name: '高位下拉',
    type: 'strength',
    sets: 2,
    reps: 12,
    duration: 0,
    weight: '中等',
    restSeconds: 60,
    videoUrl: 'https://example.com/video/pull-down.mp4',
    description: '背部训练，器械动作',
    muscleGroup: 'back',
    order: 2,
  },
  {
    id: 'ex-003',
    dayPlanId: 'day-001',
    name: '坐姿划船',
    type: 'strength',
    sets: 2,
    reps: 12,
    duration: 0,
    weight: '中等',
    restSeconds: 60,
    videoUrl: 'https://example.com/video/seated-row.mp4',
    description: '背部训练',
    muscleGroup: 'back',
    order: 3,
  },
  {
    id: 'ex-004',
    dayPlanId: 'day-001',
    name: '稳态慢跑',
    type: 'cardio',
    sets: 1,
    reps: 0,
    duration: 20,
    weight: '',
    restSeconds: 0,
    videoUrl: '',
    description: '有氧训练，保持心率 120-140',
    muscleGroup: 'cardio',
    order: 4,
  },
];

// Mock 训练进度
export const mockTrainingProgress: MockProgress = {
  id: 'progress-001',
  userId: 'user-existing-001',
  planId: 'plan-full-001',
  date: '2026-03-02',
  completedExercises: ['ex-001', 'ex-002'],
  completedSets: {
    'ex-001': 2,
    'ex-002': 1,
  },
  isCompleted: false,
  createdAt: '2026-03-02T19:00:00Z',
};

// Mock 已完成的训练进度
export const mockCompletedProgress: MockProgress = {
  ...mockTrainingProgress,
  completedExercises: ['ex-001', 'ex-002', 'ex-003', 'ex-004'],
  completedSets: {
    'ex-001': 2,
    'ex-002': 2,
    'ex-003': 2,
    'ex-004': 1,
  },
  isCompleted: true,
};

// 生成 Mock 动作
export function generateMockExercise(
  dayPlanId: string,
  order: number,
  overrides: Partial<MockExercise> = {}
): MockExercise {
  const exercises = Object.values(exerciseLibrary);
  const exercise = exercises[order % exercises.length];
  
  return {
    id: `ex-${Date.now()}-${order}`,
    dayPlanId,
    name: exercise.name,
    type: exercise.type,
    sets: 3,
    reps: 12,
    duration: exercise.type === 'cardio' ? 20 : 0,
    weight: '中等',
    restSeconds: 60,
    videoUrl: `https://example.com/video/${exercise.name}.mp4`,
    description: `${exercise.muscleGroup}训练`,
    muscleGroup: exercise.muscleGroup,
    order,
    ...overrides,
  };
}

// 生成完整的周计划
export function generateFullWeekPlan(planId: string): { dayPlans: MockDayPlan[]; exercises: MockExercise[] } {
  const dayPlans: MockDayPlan[] = [];
  const exercises: MockExercise[] = [];
  
  // 训练日配置
  const trainingDays = [1, 3, 5, 7]; // 周一、三、五、日
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const isRestDay = !trainingDays.includes(dayOfWeek);
    const dayPlan: MockDayPlan = {
      id: `day-${planId}-${dayOfWeek}`,
      planId,
      dayOfWeek,
      isRestDay,
    };
    
    dayPlans.push(dayPlan);
    
    if (!isRestDay) {
      // 训练日添加 2-4 个动作
      const exerciseCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 1; i <= exerciseCount; i++) {
        exercises.push(generateMockExercise(dayPlan.id, i));
      }
    }
  }
  
  return { dayPlans, exercises };
}

// 统计数据
export const mockWeeklyStats = {
  weekNumber: 1,
  year: 2026,
  totalDays: 7,
  trainingDays: 4,
  restDays: 3,
  completedDays: 3,
  completionRate: 0.75,
  totalExercises: 20,
  completedExercises: 15,
  totalDuration: 120, // 分钟
  checkins: [
    { date: '2026-03-02', isCompleted: true, duration: 45 },
    { date: '2026-03-04', isCompleted: true, duration: 40 },
    { date: '2026-03-06', isCompleted: true, duration: 35 },
  ],
};
