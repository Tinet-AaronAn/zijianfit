import axios from 'axios';
import { apiConfig } from '../constants';

const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const message = error.response.data?.error?.message || '请求失败';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('网络异常，请检查网络连接');
    } else {
      throw new Error('请求配置错误');
    }
  }
);

// 从本地存储获取token
async function getStoredToken(): Promise<string | null> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('token');
  } catch (error) {
    return null;
  }
}

export default api;
