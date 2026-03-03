import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 环境: ${config.nodeEnv}`);
  console.log(`💪 自健身 API 已启动`);
  console.log(`\n📖 可用路由:`);
  console.log(`   GET  /              - API 信息`);
  console.log(`   GET  /health        - 健康检查`);
});
