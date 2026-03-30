import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn(), dispatch: jest.fn() };

jest.mock('../../src/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(() => ({
    login: jest.fn(),
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  })),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form elements', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    expect(getByPlaceholderText('请输入用户名')).toBeTruthy();
    expect(getByPlaceholderText('请输入密码')).toBeTruthy();
    expect(getByText('登录')).toBeTruthy();
  });

  it('should navigate to register screen', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByText('立即注册'));

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should update input values on typing', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const usernameInput = getByPlaceholderText('请输入用户名');
    const passwordInput = getByPlaceholderText('请输入密码');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should toggle password visibility', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const passwordInput = getByPlaceholderText('请输入密码');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Find and press the eye icon
    const eyeIcons = getByText('👁‍🗨');
    fireEvent.press(eyeIcons);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
