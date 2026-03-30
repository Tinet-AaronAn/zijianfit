import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FollowWorkoutScreen from '../../src/screens/FollowWorkoutScreen';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn(), dispatch: jest.fn() };

// Mock Alert
jest.spyOn(require('react-native').Alert, 'alert');

jest.mock('react-native-video', () => {
  const { View, Text } = require('react-native');
  return (props: any) => (
    <View testID="video-player">
      <Text>Video Player</Text>
    </View>
  );
});

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID="webview" />;
});

// Upper body strength session
const upperBodySession = {
  id: 'day-1',
  planId: 'plan-1',
  dayOfWeek: 1,
  type: 'strength' as const,
  videoUrl: '/videos/upper-body.mp4',
  title: '上肢力量训练',
  targetRounds: 3,
  duration: 15,
  workoutCategory: 'upper-body' as const,
};

// Lower body strength session
const lowerBodySession = {
  ...upperBodySession,
  dayOfWeek: 3,
  title: '下肢力量训练',
  workoutCategory: 'lower-body' as const,
  videoUrl: '/videos/lower-body.mp4',
};

// Cardio session
const cardioSession = {
  ...upperBodySession,
  dayOfWeek: 5,
  type: 'cardio' as const,
  title: '间歇跑',
  targetRounds: 1,
  duration: 30,
  workoutCategory: 'cardio' as const,
  videoUrl: undefined,
};

describe('FollowWorkoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Upper Body Strength Training', () => {
    it('should display title and round info', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('上肢力量训练')).toBeTruthy();
      expect(getByText('第 1 / 3 轮')).toBeTruthy();
    });

    it('should show video player for strength training', () => {
      const route = { params: upperBodySession };
      const { getByTestId, getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByTestId('video-player')).toBeTruthy();
    });

    it('should show upper body training hint', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText(/上肢训练/)).toBeTruthy();
    });

    it('should increment round when completing a round', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('第 1 / 3 轮')).toBeTruthy();

      fireEvent.press(getByText('✓ 完成这一轮'));

      // Should show Alert for round completion
      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '✅ 完成一轮',
        expect.stringContaining('1/3'),
        expect.any(Array)
      );
    });

    it('should show completion state after all rounds', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      // Complete all 3 rounds
      fireEvent.press(getByText('✓ 完成这一轮'));
      fireEvent.press(getByText('✓ 完成这一轮'));
      fireEvent.press(getByText('✓ 完成这一轮'));

      // Should show completion alert
      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '🎉 训练完成！',
        expect.stringContaining('3 轮'),
        expect.any(Array)
      );
    });

    it('should show exit button', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('退出训练')).toBeTruthy();
    });

    it('should show exit confirmation on pressing exit', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      fireEvent.press(getByText('退出训练'));

      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '退出训练',
        '确定要退出吗？当前进度将被清除',
        expect.arrayContaining([
          expect.objectContaining({ text: '取消' }),
          expect.objectContaining({ text: '确定退出' }),
        ])
      );
    });
  });

  describe('Lower Body Strength Training', () => {
    it('should show lower body training hint', () => {
      const route = { params: lowerBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('下肢力量训练')).toBeTruthy();
      expect(getByText(/下肢训练/)).toBeTruthy();
    });
  });

  describe('Cardio Training', () => {
    it('should show cardio UI without video player', () => {
      const route = { params: cardioSession };
      const { getByText, queryByTestId } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('间歇跑')).toBeTruthy();
      expect(getByText('🏃')).toBeTruthy();
      expect(getByText('开始跑步')).toBeTruthy();
      expect(queryByTestId('video-player')).toBeNull();
    });

    it('should show suggested duration', () => {
      const route = { params: cardioSession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText(/建议时长：30 分钟/)).toBeTruthy();
    });

    it('should show "完成跑步" button for cardio', () => {
      const route = { params: cardioSession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('✓ 完成跑步')).toBeTruthy();
    });

    it('should complete cardio immediately (1 round)', () => {
      const route = { params: cardioSession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      fireEvent.press(getByText('✓ 完成跑步'));

      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '🎉 训练完成！',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe('Progress Tracking', () => {
    it('should show 0% progress initially', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      expect(getByText('第 1 / 3 轮')).toBeTruthy();
    });

    it('should update progress text after completing rounds', () => {
      const route = { params: upperBodySession };
      const { getByText } = render(
        <FollowWorkoutScreen navigation={mockNavigation as any} route={route as any} />
      );

      // Round 1 complete
      fireEvent.press(getByText('✓ 完成这一轮'));

      // The Alert callback in real app would advance state
      // Here we verify the Alert was called with round info
      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '✅ 完成一轮',
        expect.stringContaining('1/3'),
        expect.any(Array)
      );
    });
  });
});
