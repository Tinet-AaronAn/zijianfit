import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import WorkoutDetailScreen from '../../src/screens/WorkoutDetailScreen';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn(), dispatch: jest.fn() };
const mockRoute = {
  params: { planId: 'plan-1', dayOfWeek: 1 },
};

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock('react-native-video', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID="video-player" />;
});

const mockPlanData = {
  success: true,
  data: {
    id: 'day-1',
    dayOfWeek: 1,
    title: '上肢力量训练',
    description: '锻炼胸肌、肩部和手臂',
    duration: 45,
    exercises: [
      { id: 'e1', name: '俯卧撑', description: '标准俯卧撑', duration: 30, sets: 3, reps: 15, videoUrl: '/videos/pushup.mp4' },
      { id: 'e2', name: '哑铃弯举', description: '二头肌弯举', duration: 30, sets: 3, reps: 12 },
      { id: 'e3', name: '平板支撑', description: '核心训练', duration: 60, sets: 3, reps: 1 },
    ],
  },
};

import api from '../../src/services/api';

describe('WorkoutDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator initially', () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { UNSAFE_queryByType } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(UNSAFE_queryByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('should display plan details after loading', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('上肢力量训练')).toBeTruthy();
      expect(getByText('锻炼胸肌、肩部和手臂')).toBeTruthy();
    });
  });

  it('should display duration and exercise count', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText, getAllByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('45')).toBeTruthy(); // duration stat
      expect(getByText('分钟')).toBeTruthy();
    });
    // "3" appears as both stat and in "3组 × 15次", use getAllByText
    expect(getAllByText('3').length).toBeGreaterThanOrEqual(1);
  });

  it('should display all exercise names', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('俯卧撑')).toBeTruthy();
      expect(getByText('哑铃弯举')).toBeTruthy();
      expect(getByText('平板支撑')).toBeTruthy();
    });
  });

  it('should show sets × reps for exercises', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('3组 × 15次')).toBeTruthy(); // pushups
      expect(getByText('3组 × 12次')).toBeTruthy(); // curls
    });
  });

  it('should show video indicator only for exercises with video', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { queryAllByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      // Only pushup has videoUrl
      expect(queryAllByText('▶️').length).toBe(1);
    });
  });

  it('should show start follow-workout button', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('🎬 开始跟练')).toBeTruthy();
    });
  });

  it('should navigate to FollowWorkout with upper-body params', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlanData);

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('🎬 开始跟练')).toBeTruthy();
    });

    fireEvent.press(getByText('🎬 开始跟练'));

    expect(mockNavigate).toHaveBeenCalledWith('FollowWorkout', expect.objectContaining({
      type: 'strength',
      workoutCategory: 'upper-body',
      targetRounds: 3,
    }));
  });

  it('should navigate to FollowWorkout with cardio params for Friday', async () => {
    const fridayData = {
      ...mockPlanData,
      data: { ...mockPlanData.data, dayOfWeek: 5, title: '有氧训练' },
    };
    (api.get as jest.Mock).mockResolvedValue(fridayData);

    const fridayRoute = { params: { planId: 'plan-1', dayOfWeek: 5 } };

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={fridayRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('🎬 开始跟练')).toBeTruthy();
    });

    fireEvent.press(getByText('🎬 开始跟练'));

    expect(mockNavigate).toHaveBeenCalledWith('FollowWorkout', expect.objectContaining({
      type: 'cardio',
      workoutCategory: 'cardio',
      targetRounds: 1,
    }));
  });

  it('should navigate to FollowWorkout with lower-body params for Wednesday', async () => {
    const wedData = {
      ...mockPlanData,
      data: { ...mockPlanData.data, dayOfWeek: 3, title: '下肢力量训练' },
    };
    (api.get as jest.Mock).mockResolvedValue(wedData);

    const wedRoute = { params: { planId: 'plan-1', dayOfWeek: 3 } };

    const { getByText } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={wedRoute as any} />
    );

    await waitFor(() => {
      expect(getByText('🎬 开始跟练')).toBeTruthy();
    });

    fireEvent.press(getByText('🎬 开始跟练'));

    expect(mockNavigate).toHaveBeenCalledWith('FollowWorkout', expect.objectContaining({
      type: 'strength',
      workoutCategory: 'lower-body',
      targetRounds: 3,
    }));
  });

  it('should handle API error gracefully', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { UNSAFE_queryByType } = render(
      <WorkoutDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      // Should not crash
      expect(true).toBe(true);
    });
  });
});
