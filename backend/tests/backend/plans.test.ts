/**
 * 训练计划 API 测试
 * TC-WORKOUT 系列测试用例
 */

import request from 'supertest';
import app from '../../src/app';
import {
  createTestUser,
  createFullTestPlan,
  cleanupTestData,
  generateTestToken,
  prisma,
} from '../helpers/testDb';

// 创建测试服务器
const server = app.listen(3004);

describe('训练计划 API 测试', () => {
  let testUser: any;
  let testToken: string;
  let testPlan: any;

  // 每个测试前准备数据
  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    testToken = generateTestToken(testUser.id);
    const result = await createFullTestPlan(testUser.id);
    testPlan = result.plan;
  });

  // 所有测试后清理
  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  describe('GET /api/plans/current - 获取当前周计划', () => {
    it('TC-WORKOUT-001: 应该返回 7 天完整计划', async () => {
      const response = await request(server)
        .get('/api/plans/current')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('weekNumber');
      expect(response.body.data).toHaveProperty('year');
      expect(response.body.data.days).toHaveLength(7);
    });

    it('应该正确区分训练日和休息日', async () => {
      const response = await request(server)
        .get('/api/plans/current')
        .set('Authorization', `Bearer ${testToken}`);

      const days = response.body.data.days;
      const restDays = days.filter((d: any) => d.isRestDay);
      const trainingDays = days.filter((d: any) => !d.isRestDay);

      expect(restDays.length).toBe(3); // 周二、四、六休息
      expect(trainingDays.length).toBe(4);
    });

    it('训练日应该显示动作数量', async () => {
      const response = await request(server)
        .get('/api/plans/current')
        .set('Authorization', `Bearer ${testToken}`);

      const trainingDays = response.body.data.days.filter(
        (d: any) => !d.isRestDay
      );

      trainingDays.forEach((day: any) => {
        expect(day.exerciseCount).toBeGreaterThan(0);
      });
    });

    it('未认证用户也可以访问（可选认证）', async () => {
      const response = await request(server).get('/api/plans/current');

      // 计划接口允许游客访问，使用 optionalAuth
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/plans/:planId/days/:dayOfWeek - 获取某日训练详情', () => {
    it('TC-WORKOUT-002: 应该返回训练日详情', async () => {
      const response = await request(server)
        .get(`/api/plans/${testPlan.id}/days/1`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('dayOfWeek', 1);
      expect(response.body.data).toHaveProperty('isRestDay', false);
      expect(response.body.data.exercises).toBeDefined();
      expect(response.body.data.exercises.length).toBeGreaterThan(0);
    });

    it('TC-WORKOUT-003: 休息日应该返回休息提示', async () => {
      const response = await request(server)
        .get(`/api/plans/${testPlan.id}/days/2`) // 周二休息
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.isRestDay).toBe(true);
      expect(response.body.data.exercises).toHaveLength(0);
    });

    it('TC-WORKOUT-015: 无效的 dayOfWeek 应该返回错误', async () => {
      const response = await request(server)
        .get(`/api/plans/${testPlan.id}/days/999`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_PARAMS');
    });

    it('TC-ERROR-010: 无效的 planId 应该返回 404', async () => {
      const response = await request(server)
        .get('/api/plans/non-existent-id/days/1')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('应该返回完整的动作信息', async () => {
      const response = await request(server)
        .get(`/api/plans/${testPlan.id}/days/1`)
        .set('Authorization', `Bearer ${testToken}`);

      const exercise = response.body.data.exercises[0];
      expect(exercise).toHaveProperty('id');
      expect(exercise).toHaveProperty('name');
      expect(exercise).toHaveProperty('sets');
      expect(exercise).toHaveProperty('reps');
      expect(exercise).toHaveProperty('restSeconds');
    });
  });

  describe('GET /api/plans/:planId - 获取计划详情', () => {
    it('应该返回完整计划信息', async () => {
      const response = await request(server)
        .get(`/api/plans/${testPlan.id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', testPlan.id);
    });
  });
});
