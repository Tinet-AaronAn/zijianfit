import { Context } from 'koa';

/**
 * 统一响应格式
 */
export class ResponseUtil {
  /**
   * 成功响应
   */
  static success(ctx: Context, data: any, message = '操作成功') {
    ctx.body = {
      success: true,
      message,
      data,
    };
  }

  /**
   * 失败响应
   */
  static error(ctx: Context, code: string, message: string, statusCode = 400) {
    ctx.status = statusCode;
    ctx.body = {
      success: false,
      error: {
        code,
        message,
      },
    };
  }

  /**
   * 未授权
   */
  static unauthorized(ctx: Context, message = '未授权') {
    this.error(ctx, 'UNAUTHORIZED', message, 401);
  }

  /**
   * 资源不存在
   */
  static notFound(ctx: Context, message = '资源不存在') {
    this.error(ctx, 'NOT_FOUND', message, 404);
  }

  /**
   * 参数错误
   */
  static invalidParams(ctx: Context, message = '参数错误') {
    this.error(ctx, 'INVALID_PARAMS', message, 400);
  }

  /**
   * 服务器错误
   */
  static internalError(ctx: Context, message = '服务器内部错误') {
    this.error(ctx, 'INTERNAL_ERROR', message, 500);
  }
}
