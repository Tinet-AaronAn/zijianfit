import Router from '@koa/router';
import {
  getCurrentPlan,
  getDayPlan,
  getPlanById
} from '../controllers/plans.controller';
import { optionalAuth } from '../middleware/auth';

const router = new Router({
  prefix: '/api/plans',
});

// 所有计划接口都是可选认证（未登录也能查看）
router.get('/current', optionalAuth, getCurrentPlan);
router.get('/:planId', optionalAuth, getPlanById);
router.get('/:planId/days/:dayOfWeek', optionalAuth, getDayPlan);

export default router;
