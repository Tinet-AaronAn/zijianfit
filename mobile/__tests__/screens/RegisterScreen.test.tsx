import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from '../../src/screens/RegisterScreen';

const mockGoBack = jest.fn();
const mockNavigation = { navigate: jest.fn(), goBack: mockGoBack, dispatch: jest.fn() };

jest.mock('../../src/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(() => ({
    register: jest.fn(),
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  })),
}));

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render register form elements', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation as any} />
    );

    expect(getByPlaceholderText('4-20个字符，字母数字下划线')).toBeTruthy();
    expect(getByPlaceholderText('6-20个字符，需包含字母和数字')).toBeTruthy();
    expect(getByPlaceholderText('再次输入密码')).toBeTruthy();
  });

  it('should update input fields', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation as any} />
    );

    const usernameInput = getByPlaceholderText('4-20个字符，字母数字下划线');
    const passwordInput = getByPlaceholderText('6-20个字符，需包含字母和数字');
    const confirmInput = getByPlaceholderText('再次输入密码');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
    expect(confirmInput.props.value).toBe('password123');
  });

  it('should call goBack when tapping return to login', () => {
    const { getByText } = render(
      <RegisterScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByText('立即登录'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
