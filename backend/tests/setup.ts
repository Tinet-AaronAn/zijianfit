/**
 * 测试环境配置
 * 用于 Jest + Supertest API 测试
 */

import { PrismaClient } from '@prisma/client';

// 使用测试数据库
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.PORT = '3002'; // 测试服务器端口
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRES_IN = '1h';

// Mock 微信配置

// 全局 Prisma 客户端
const prisma = new PrismaClient();

// 全局 setup - 延迟执行
let isSetup = false;

export const setupTestDb = async () => {
  if (isSetup) return;
  isSetup = true;
  
  // 确保测试数据库连接
  await prisma.$connect();
};

export const teardownTestDb = async () => {
  // 清理测试数据
  await prisma.progress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.dayPlan.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();
  
  // 断开连接
  await prisma.$disconnect();
};

// 导出供其他测试文件使用
export { prisma };
