import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ResponseUtil } from '../utils/response';

/**
 * JWT 认证中间件
 */
export async function authMiddleware(ctx: Context, next: Next) {
  // 从 header 获取 token
  const authorization = ctx.header.authorization;

  if (!authorization) {
    ResponseUtil.unauthorized(ctx, '缺少 Authorization header');
    return;
  }

  // 解析 Bearer token
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    ResponseUtil.unauthorized(ctx, 'Authorization header 格式错误');
    return;
  }

  const token = parts[1];

  try {
    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    // 将用户信息挂载到 ctx.state
    ctx.state.user = {
      id: decoded.id,
      openid: decoded.openid,
    };

    await next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      ResponseUtil.unauthorized(ctx, 'Token 已过期');
    } else if (err.name === 'JsonWebTokenError') {
      ResponseUtil.unauthorized(ctx, 'Token 无效');
    } else {
      ResponseUtil.unauthorized(ctx, 'Token 验证失败');
    }
  }
}

/**
 * 可选认证中间件（不强制要求登录）
 */
export async function optionalAuth(ctx: Context, next: Next) {
  const authorization = ctx.header.authorization;

  if (authorization) {
    const parts = authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        ctx.state.user = {
          id: decoded.id,
          openid: decoded.openid,
        };
      } catch (err) {
        // 忽略错误，继续执行
      }
    }
  }

  await next();
}
