/**
 * 安全头部中间件
 * 添加常见的安全相关 HTTP 头
 */

import { Context, Next } from 'koa';

export const securityHeaders = async (ctx: Context, next: Next) => {
  // 防止点击劫持
  ctx.set('X-Frame-Options', 'DENY');

  // 防止 MIME 类型嗅探
  ctx.set('X-Content-Type-Options', 'nosniff');

  // XSS 保护
  ctx.set('X-XSS-Protection', '1; mode=block');

  // 禁用引用策略
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 内容安全策略（根据实际需求调整）
  // ctx.set('Content-Security-Policy', "default-src 'self'");

  // HSTS（仅在生产环境且使用 HTTPS 时启用）
  if (process.env.NODE_ENV === 'production') {
    ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  await next();
};
