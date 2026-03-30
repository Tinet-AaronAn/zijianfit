import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DayPickerModal from '../../src/components/DayPickerModal';

const mockDays = [
  {
    dayOfWeek: 1,
    title: '上肢力量训练',
    isRestDay: false,
    exerciseCount: 6,
    duration: 45,
    planId: 'plan-1',
  },
  {
    dayOfWeek: 2,
    title: '下肢力量训练',
    isRestDay: false,
    exerciseCount: 5,
    duration: 40,
    planId: 'plan-1',
  },
  {
    dayOfWeek: 3,
    title: '休息日',
    isRestDay: true,
    exerciseCount: 0,
    duration: 0,
    planId: 'plan-1',
  },
  {
    dayOfWeek: 4,
    title: '有氧训练',
    isRestDay: false,
    exerciseCount: 4,
    duration: 30,
    planId: 'plan-1',
  },
];

describe('DayPickerModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    days: mockDays,
    onSelectDay: jest.fn(),
    today: 1, // Monday
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with title when visible', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    expect(getByText('选择训练日')).toBeTruthy();
    expect(getByText('选择一天的训练计划开始锻炼')).toBeTruthy();
  });

  it('should render all day options', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    expect(getByText('上肢力量训练')).toBeTruthy();
    expect(getByText('下肢力量训练')).toBeTruthy();
    expect(getByText('休息日')).toBeTruthy();
    expect(getByText('有氧训练')).toBeTruthy();
  });

  it('should show exercise count and duration for non-rest days', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    expect(getByText('6个动作 · 45分钟')).toBeTruthy();
    expect(getByText('5个动作 · 40分钟')).toBeTruthy();
    expect(getByText('4个动作 · 30分钟')).toBeTruthy();
  });

  it('should show "今天" tag for today', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    expect(getByText('今天')).toBeTruthy();
  });

  it('should call onSelectDay when a day is pressed', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    fireEvent.press(getByText('下肢力量训练'));

    expect(defaultProps.onSelectDay).toHaveBeenCalledWith(
      expect.objectContaining({
        dayOfWeek: 2,
        title: '下肢力量训练',
      })
    );
  });

  it('should call onClose when day is selected (auto-close)', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    fireEvent.press(getByText('有氧训练'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    fireEvent.press(getByText('✕'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should show empty state when no days', () => {
    const { getByText } = render(
      <DayPickerModal {...defaultProps} days={[]} />
    );

    expect(getByText('暂无训练计划')).toBeTruthy();
  });

  it('should show day names correctly', () => {
    const { getByText } = render(<DayPickerModal {...defaultProps} />);

    expect(getByText('周一')).toBeTruthy();
    expect(getByText('周二')).toBeTruthy();
    expect(getByText('周三')).toBeTruthy();
    expect(getByText('周四')).toBeTruthy();
  });

  it('should not show arrow for rest days', () => {
    const { getByText, queryAllByText } = render(
      <DayPickerModal {...defaultProps} />
    );

    // Rest day (周三) should exist but not have → arrow in its row
    expect(getByText('休息日')).toBeTruthy();
    // → arrows should only appear for non-rest days (3 arrows for 3 non-rest days)
    const arrows = queryAllByText('→');
    expect(arrows.length).toBe(3);
  });
});
