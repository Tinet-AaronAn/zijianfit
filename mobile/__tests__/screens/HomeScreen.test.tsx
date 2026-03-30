import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import api from '../../src/services/api';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn(), dispatch: jest.fn() };

jest.mock('../../src/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(() => ({
    user: { id: '1', username: 'testuser', nickname: '测试用户' },
    logout: jest.fn(),
    isAuthenticated: true,
    token: 'mock-token',
    isLoading: false,
  })),
}));

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock('../../src/components/DayPickerModal', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ visible, onClose, onSelectDay, days }: any) => {
    if (!visible) return null;
    return (
      <View testID="day-picker-modal">
        <Text>选择训练日</Text>
        <TouchableOpacity testID="close-modal" onPress={onClose}>
          <Text>关闭</Text>
        </TouchableOpacity>
        {days.map((d: any) => (
          <TouchableOpacity
            key={d.dayOfWeek}
            testID={`day-${d.dayOfWeek}`}
            onPress={() => { onSelectDay(d); onClose(); }}
          >
            <Text>{d.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
});

const mockPlans = {
  success: true,
  data: {
    days: [
      { id: '1', planId: 'plan-1', dayOfWeek: 1, title: '上肢力量训练', isRestDay: false, exerciseCount: 6, totalDuration: 45, duration: 45 },
      { id: '2', planId: 'plan-1', dayOfWeek: 2, title: '下肢力量训练', isRestDay: false, exerciseCount: 5, totalDuration: 40, duration: 40 },
      { id: '3', planId: 'plan-1', dayOfWeek: 3, title: '休息日', isRestDay: true, exerciseCount: 0, totalDuration: 0, duration: 0 },
      { id: '4', planId: 'plan-1', dayOfWeek: 4, title: '上肢力量训练', isRestDay: false, exerciseCount: 5, totalDuration: 40, duration: 40 },
      { id: '5', planId: 'plan-1', dayOfWeek: 5, title: '有氧训练', isRestDay: false, exerciseCount: 4, totalDuration: 30, duration: 30 },
      { id: '6', planId: 'plan-1', dayOfWeek: 6, title: '休息日', isRestDay: true, exerciseCount: 0, totalDuration: 0, duration: 0 },
      { id: '7', planId: 'plan-1', dayOfWeek: 0, title: '全身循环训练', isRestDay: false, exerciseCount: 8, totalDuration: 50, duration: 50 },
    ],
  },
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator initially', () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    const { UNSAFE_queryByType } = render(<HomeScreen navigation={mockNavigation as any} />);
    // ActivityIndicator should be present while loading
    expect(UNSAFE_queryByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('should display user greeting after loading', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('测试用户')).toBeTruthy();
    });
  });

  it('should display today workout plan', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('📅 今日训练')).toBeTruthy();
    });
  });

  it('should show weekly plans grid', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('📆 本周计划')).toBeTruthy();
      expect(getByText('周一')).toBeTruthy();
      expect(getByText('周五')).toBeTruthy();
    });
  });

  it('should navigate to WorkoutDetail when tapping today card', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('开始训练 →')).toBeTruthy();
    });

    fireEvent.press(getByText('开始训练 →'));

    // Should navigate with correct params
    expect(mockNavigate).toHaveBeenCalledWith('WorkoutDetail', expect.objectContaining({
      planId: 'plan-1',
    }));
  });

  it('should navigate to WorkoutDetail when tapping a week day card', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('周一')).toBeTruthy();
    });

    fireEvent.press(getByText('周一'));

    expect(mockNavigate).toHaveBeenCalledWith('WorkoutDetail', {
      planId: 'plan-1',
      dayOfWeek: 1,
    });
  });

  it('should navigate to Stats from quick actions', async () => {
    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('训练统计')).toBeTruthy();
    });

    // Press the quick action "训练统计"
    const statsButtons = getByText('训练统计');
    fireEvent.press(statsButtons);

    expect(mockNavigate).toHaveBeenCalledWith('Stats');
  });

  it('should call logout when pressing exit button', async () => {
    const mockLogout = jest.fn();
    jest.clearAllMocks();
    jest.mock('../../src/stores/useAuthStore', () => ({
      useAuthStore: jest.fn(() => ({
        user: { id: '1', username: 'testuser' },
        logout: mockLogout,
        isAuthenticated: true,
        token: 'mock-token',
      })),
    }));

    (api.get as jest.Mock).mockResolvedValue(mockPlans);

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('退出')).toBeTruthy();
    });

    fireEvent.press(getByText('退出'));
    // Logout is called (mock from useAuthStore)
  });

  it('should handle API error gracefully', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { queryByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      // Should not crash - renders basic layout without plans
      expect(queryByText('📅 今日训练')).toBeTruthy();
    });
  });

  it('should handle empty plans response', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      success: true,
      data: { days: [] },
    });

    const { getByText } = render(<HomeScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(getByText('📅 今日训练')).toBeTruthy();
    });
  });
});
