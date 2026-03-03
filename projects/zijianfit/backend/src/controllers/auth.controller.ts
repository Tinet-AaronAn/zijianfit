import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ResponseUtil } from '../utils/response';
import { config } from '../config';

const prisma = new PrismaClient();

/**
 * 用户注册
 * POST /api/auth/register
 */
export async function register(ctx: Context) {
  const { username, password, confirmPassword, nickname } = ctx.request.body as any;

  // 验证必填字段
  if (!username || !password || !confirmPassword) {
    ResponseUtil.invalidParams(ctx, '用户名、密码和确认密码为必填项');
    return;
  }

  // 验证用户名格式
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  if (!usernameRegex.test(username)) {
    ResponseUtil.error(ctx, 'USERNAME_INVALID', '用户名格式不正确（4-20个字符，字母数字下划线）');
    return;
  }

  // 验证密码格式
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/;
  if (!passwordRegex.test(password)) {
    ResponseUtil.error(ctx, 'PASSWORD_INVALID', '密码格式不正确（6-20个字符，至少包含字母和数字）');
    return;
  }

  // 验证两次密码一致
  if (password !== confirmPassword) {
    ResponseUtil.error(ctx, 'PASSWORD_MISMATCH', '两次密码输入不一致');
    return;
  }

  // 验证昵称长度
  if (nickname && nickname.length > 20) {
    ResponseUtil.error(ctx, 'NICKNAME_TOO_LONG', '昵称不能超过20个字符');
    return;
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      ResponseUtil.error(ctx, 'USERNAME_EXISTS', '用户名已存在');
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || username,
      },
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      String(config.jwt.secret),
      { expiresIn: '7d' }
    );

    ResponseUtil.success(ctx, {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
      expiresIn: 604800, // 7天（秒）
    }, '注册成功');
  } catch (error: any) {
    console.error('注册错误:', error);
    ResponseUtil.internalError(ctx, '注册失败');
  }
}

/**
 * 用户登录
 * POST /api/auth/login
 */
export async function login(ctx: Context) {
  const { username, password } = ctx.request.body as any;

  // 验证必填字段
  if (!username || !password) {
    ResponseUtil.invalidParams(ctx, '用户名和密码为必填项');
    return;
  }

  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      ResponseUtil.error(ctx, 'USER_NOT_FOUND', '用户不存在');
      return;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      ResponseUtil.error(ctx, 'PASSWORD_ERROR', '密码错误');
      return;
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      String(config.jwt.secret),
      { expiresIn: '7d' }
    );

    ResponseUtil.success(ctx, {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      token,
      expiresIn: 604800, // 7天（秒）
    }, '登录成功');
  } catch (error: any) {
    console.error('登录错误:', error);
    ResponseUtil.internalError(ctx, '登录失败');
  }
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
export async function getCurrentUser(ctx: Context) {
  const userId = ctx.state.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      ResponseUtil.notFound(ctx, '用户不存在');
      return;
    }

    ResponseUtil.success(ctx, {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    ResponseUtil.internalError(ctx, '获取用户信息失败');
  }
}

/**
 * 刷新 token
 * POST /api/auth/refresh
 */
export async function refreshToken(ctx: Context) {
  const userId = ctx.state.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      ResponseUtil.notFound(ctx, '用户不存在');
      return;
    }

    // 生成新的 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      String(config.jwt.secret),
      { expiresIn: '7d' }
    );

    ResponseUtil.success(ctx, { 
      token,
      expiresIn: 604800, // 7天（秒）
    }, 'Token 刷新成功');
  } catch (error: any) {
    console.error('刷新 token 错误:', error);
    ResponseUtil.internalError(ctx, '刷新 token 失败');
  }
}
