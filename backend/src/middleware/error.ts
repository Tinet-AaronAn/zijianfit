import { Context, Next } from 'koa';
import { ResponseUtil } from '../utils/response';
import winston from 'winston';

// 创建日志记录器
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * 全局错误处理中间件
 */
export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    // 记录错误日志
    logger.error('Error occurred:', {
      error: err.message,
      stack: err.stack,
      path: ctx.path,
      method: ctx.method,
      body: ctx.request.body,
    });

    // 根据错误类型返回不同的响应
    if (err.name === 'UnauthorizedError') {
      ResponseUtil.unauthorized(ctx, 'Token 无效或已过期');
      return;
    }

    if (err.name === 'ValidationError') {
      ResponseUtil.invalidParams(ctx, err.message);
      return;
    }

    // 默认服务器错误
    ResponseUtil.internalError(ctx, err.message || '服务器内部错误');
  }
}
