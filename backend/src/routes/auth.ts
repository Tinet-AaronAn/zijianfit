import Router from '@koa/router';
import {
  register,
  login,
  getCurrentUser,
  refreshToken
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = new Router({
  prefix: '/api/auth',
});

// 公开路由（不需要认证）
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.get('/me', authMiddleware, getCurrentUser);
router.post('/refresh', authMiddleware, refreshToken);

export default router;
