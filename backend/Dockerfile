# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 生成 Prisma Client
RUN npx prisma generate

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 复制必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# 创建数据目录
RUN mkdir -p /app/data

# 设置环境变量
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/prod.db

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "dist/server.js"]
