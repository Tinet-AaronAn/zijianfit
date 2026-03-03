/**
 * 认证 API 测试 - 用户名密码登录
 * TC-AUTH 系列测试用例
 */

import request from 'supertest';
import app from '../../src/app';
import {
  createTestUser,
  cleanupTestData,
  generateTestToken,
  prisma,
} from '../helpers/testDb';

// 创建测试服务器
const server = app.listen(3002);

describe('认证 API 测试 - 用户名密码登录', () => {
  // 每个测试前清理数据
  beforeEach(async () => {
    await cleanupTestData();
  });

  // 所有测试后清理
  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  describe('POST /api/auth/register - 用户注册', () => {
    it('TC-AUTH-001: 正常注册应该成功', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
          nickname: '测试用户',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.user.nickname).toBe('测试用户');
    });

    it('TC-AUTH-002: 用户名已存在应该返回错误', async () => {
      // 先注册一个用户
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });

      // 再次注册相同用户名
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USERNAME_EXISTS');
    });

    it('TC-AUTH-003: 用户名格式不正确应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'ab', // 少于4个字符
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USERNAME_INVALID');
    });

    it('TC-AUTH-004: 密码格式不正确应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: '123456', // 缺少字母
          confirmPassword: '123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PASSWORD_INVALID');
    });

    it('TC-AUTH-005: 两次密码不一致应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123457',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PASSWORD_MISMATCH');
    });

    it('TC-AUTH-006: 缺少必填参数应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          // 缺少 password 和 confirmPassword
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_PARAMS');
    });
  });

  describe('POST /api/auth/login - 用户登录', () => {
    beforeEach(async () => {
      // 创建测试用户
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });
    });

    it('TC-AUTH-007: 正常登录应该成功', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123456',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.username).toBe('testuser');
    });

    it('TC-AUTH-008: 用户不存在应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'Test123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_NOT_FOUND');
    });

    it('TC-AUTH-009: 密码错误应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PASSWORD_ERROR');
    });

    it('TC-AUTH-010: 缺少参数应该返回错误', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          // 缺少 password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_PARAMS');
    });
  });

  describe('GET /api/auth/me - 获取当前用户', () => {
    it('TC-AUTH-011: 无 Token 应该返回 401', async () => {
      const response = await request(server).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('TC-AUTH-012: 无效 Token 应该返回 401', async () => {
      const response = await request(server)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('TC-AUTH-013: 有效 Token 应该返回用户信息', async () => {
      // 注册并登录
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });

      const token = registerResponse.body.data.token;

      const response = await request(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('username', 'testuser');
    });
  });

  describe('POST /api/auth/refresh - 刷新 Token', () => {
    it('TC-AUTH-014: 有效 Token 刷新应该成功', async () => {
      // 注册并登录
      const registerResponse = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'Test123456',
          confirmPassword: 'Test123456',
        });

      const token = registerResponse.body.data.token;

      const response = await request(server)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.token).not.toBe(token); // 应该是新的 token
    });

    it('TC-AUTH-015: 无效 Token 刷新应该失败', async () => {
      const response = await request(server)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
