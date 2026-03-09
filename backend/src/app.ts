import Koa from 'koa';
import logger from 'koa-logger';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import path from 'path';
import { errorHandler } from './middleware/error';
import { securityHeaders } from './middleware/security';
import { rateLimit } from './middleware/rateLimit';
import { config } from './config';
import authRoutes from './routes/auth';
import plansRoutes from './routes/plans';

// 创建 Koa 应用
const app = new Koa();
const router = new Router();

// 全局中间件
app.use(securityHeaders); // 安全头部

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 静态文件服务 - 视频文件
app.use(serve(path.join(__dirname, '../public')));

app.use(bodyParser());
app.use(errorHandler); // 错误处理

// 速率限制（仅在生产环境）
if (config.nodeEnv === 'production') {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 最多 100 次请求
  }));
}

app.use(logger()); // 日志

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  };
});

// 基础路由
router.get('/', async (ctx) => {
  ctx.body = {
    name: '自健身 API',
    version: '1.0.0',
    description: '面向家庭健身用户的健身计划管理工具',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh',
      },
      plans: {
        current: 'GET /api/plans/current',
        byId: 'GET /api/plans/:planId',
        dayPlan: 'GET /api/plans/:planId/days/:dayOfWeek',
      },
    },
  };
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

// 注册业务路由
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());
app.use(plansRoutes.routes());
app.use(plansRoutes.allowedMethods());

export default app;
