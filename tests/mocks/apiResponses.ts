/**
 * Mock API 响应数据
 * 用于前端开发和测试
 */

// 用户相关 Mock
export const mockUser = {
  id: 'user-test-001',
  openid: 'test_openid_001',
  phone: '138****8888',
  nickname: '测试用户',
  avatar: 'https://example.com/avatar.png',
  createdAt: '2026-03-01T10:00:00Z',
};

export const mockAuthResponse = {
  success: true,
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token',
    user: mockUser,
    isNewUser: false,
  },
};

export const mockPhoneBindResponse = {
  success: true,
  data: {
    phone: '138****8888',
  },
};

export const mockRefreshTokenResponse = {
  success: true,
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_token',
  },
};

// 训练计划 Mock
export const mockPlan = {
  id: 'plan-test-001',
  weekNumber: 1,
  year: 2026,
  createdAt: '2026-03-01T00:00:00Z',
};

export const mockCurrentPlanResponse = {
  success: true,
  data: {
    id: 'plan-test-001',
    weekNumber: 1,
    year: 2026,
    days: [
      {
        dayOfWeek: 1,
        date: '2026-03-02',
        isRestDay: false,
        title: '上肢力量 + 稳态慢跑',
        label: '8 个动作',
        exerciseCount: 8,
      },
      {
        dayOfWeek: 2,
        date: '2026-03-03',
        isRestDay: true,
        title: '休息',
        label: '休息',
        exerciseCount: 0,
      },
      {
        dayOfWeek: 3,
        date: '2026-03-04',
        isRestDay: false,
        title: '下肢力量',
        label: '6 个动作',
        exerciseCount: 6,
      },
      {
        dayOfWeek: 4,
        date: '2026-03-05',
        isRestDay: true,
        title: '休息',
        label: '休息',
        exerciseCount: 0,
      },
      {
        dayOfWeek: 5,
        date: '2026-03-06',
        isRestDay: false,
        title: '核心训练',
        label: '5 个动作',
        exerciseCount: 5,
      },
      {
        dayOfWeek: 6,
        date: '2026-03-07',
        isRestDay: true,
        title: '休息',
        label: '休息',
        exerciseCount: 0,
      },
      {
        dayOfWeek: 7,
        date: '2026-03-08',
        isRestDay: false,
        title: '全身训练',
        label: '7 个动作',
        exerciseCount: 7,
      },
    ],
  },
};

// 动作 Mock
export const mockExercise = {
  id: 'exercise-test-001',
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
};

export const mockDayPlanResponse = {
  success: true,
  data: {
    dayOfWeek: 1,
    dayName: '周一',
    date: '2026-03-02',
    isRestDay: false,
    title: '上肢力量 + 稳态慢跑',
    totalDuration: 50,
    exercises: [
      {
        id: 'exercise-001',
        name: '哑铃推举',
        type: 'strength',
        sets: 2,
        reps: 12,
        duration: 0,
        weight: '10-12kg/只',
        restSeconds: 60,
        videoUrl: 'https://example.com/video1.mp4',
        description: '肩部训练',
        muscleGroup: 'shoulders',
        order: 1,
      },
      {
        id: 'exercise-002',
        name: '高位下拉',
        type: 'strength',
        sets: 2,
        reps: 12,
        duration: 0,
        weight: '中等',
        restSeconds: 60,
        videoUrl: 'https://example.com/video2.mp4',
        description: '背部训练',
        muscleGroup: 'back',
        order: 2,
      },
      {
        id: 'exercise-003',
        name: '坐姿划船',
        type: 'strength',
        sets: 2,
        reps: 12,
        duration: 0,
        weight: '中等',
        restSeconds: 60,
        videoUrl: 'https://example.com/video3.mp4',
        description: '背部训练',
        muscleGroup: 'back',
        order: 3,
      },
    ],
  },
};

// 进度 Mock
export const mockSetCompleteResponse = {
  success: true,
  data: {
    exerciseId: 'exercise-001',
    completedSets: 1,
    totalSets: 2,
    isExerciseComplete: false,
  },
};

export const mockCheckinResponse = {
  success: true,
  data: {
    id: 'progress-001',
    isCompleted: true,
    completedAt: '2026-03-02T20:30:00Z',
  },
};

// 统计 Mock
export const mockWeeklyStatsResponse = {
  success: true,
  data: {
    weekNumber: 1,
    year: 2026,
    totalDays: 7,
    completedDays: 3,
    completionRate: 0.75,
    totalExercises: 26,
    completedExercises: 18,
    checkins: [
      { date: '2026-03-02', isCompleted: true },
      { date: '2026-03-04', isCompleted: false },
      { date: '2026-03-06', isCompleted: true },
    ],
  },
};

// 错误响应 Mock
export const mockErrorResponse = {
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: '错误描述',
  },
};

export const mockUnauthorizedResponse = {
  success: false,
  error: {
    code: 'UNAUTHORIZED',
    message: '缺少 Authorization header',
  },
};

export const mockNotFoundResponse = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: '资源不存在',
  },
};

export const mockInvalidParamsResponse = {
  success: false,
  error: {
    code: 'INVALID_PARAMS',
    message: '参数错误',
  },
};

// 休息日响应
export const mockRestDayResponse = {
  success: true,
  data: {
    dayOfWeek: 2,
    dayName: '周二',
    date: '2026-03-03',
    isRestDay: true,
    title: '休息',
    exercises: [],
  },
};
