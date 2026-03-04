import app from './app';
import { config } from './config';

const PORT = config.port;
const HOST = process.env.HOST || '0.0.0.0'; // 监听所有网络接口，支持真机测试

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📱 真机访问: http://172.16.21.187:${PORT}`);
  console.log(`📝 环境: ${config.nodeEnv}`);
  console.log(`💪 自健身 API 已启动`);
  console.log(`\n📖 可用路由:`);
  console.log(`   GET  /              - API 信息`);
  console.log(`   GET  /health        - 健康检查`);
});
