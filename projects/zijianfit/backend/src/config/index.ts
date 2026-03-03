import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 加载 .env 文件
dotenv.config({ path: resolve(__dirname, '../../.env') });

export const config = {
  // 服务配置
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // 微信配置
  wechat: {
    appId: process.env.WECHAT_APPID || '',
    appSecret: process.env.WECHAT_APPSECRET || '',
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
};
