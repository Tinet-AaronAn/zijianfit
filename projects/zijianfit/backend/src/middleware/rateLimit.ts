/**
 * 速率限制中间件
 * 防止 API 被滥用
 */

import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// 清理过期记录
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // 每分钟清理一次

export const rateLimit = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
} = {}) => {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 默认 15 分钟
    max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 默认 100 次
    message = '请求过于频繁，请稍后再试',
  } = options;

  return async (ctx: Context, next: Next) => {
    const ip = ctx.ip;
    const now = Date.now();

    // 获取或创建记录
    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // 增加计数
    store[ip].count++;

    // 设置响应头
    ctx.set('X-RateLimit-Limit', max.toString());
    ctx.set('X-RateLimit-Remaining', Math.max(0, max - store[ip].count).toString());
    ctx.set('X-RateLimit-Reset', new Date(store[ip].resetTime).toISOString());

    // 检查是否超限
    if (store[ip].count > max) {
      logger.warn('速率限制触发', { ip, count: store[ip].count, max });
      ctx.status = 429;
      ctx.body = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
        },
      };
      return;
    }

    await next();
  };
};
