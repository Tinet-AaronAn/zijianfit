import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
}

export interface User {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn?: number;
  };
  message?: string;
}

export const authService = {
  /**
   * 用户登录
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);

    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);

    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  /**
   * 刷新Token
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');

    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }

    return response;
  },

  /**
   * 退出登录
   */
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};
