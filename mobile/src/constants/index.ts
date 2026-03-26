// 颜色
export const colors = {
  primary: '#FF6B35',
  secondary: '#1A1A2E',
  accent: '#00D9FF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  disabled: '#D1D5DB',
};

// 字体大小
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// 间距
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// 圆角
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// 阴影
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// API配置
import { Platform } from 'react-native';

// 开发环境 API 地址
// 真机测试时，修改为你电脑的局域网 IP
const DEV_API_URL = 'http://10.0.2.2:3001/api';

// 生产环境 API 地址
const PROD_API_URL = 'http://www.flyflux.cn:3001/api';

// 根据平台自动选择 API 地址
const getBaseURL = () => {
  // 生产环境
  if (__DEV__ === false) {
    return PROD_API_URL;
  }

  // 开发环境
  return DEV_API_URL;
};

export const apiConfig = {
  baseURL: getBaseURL(),
  timeout: 10000,
};
