# ========================================
# 阶段 1: 构建阶段
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 OpenSSL 1.1 兼容库（Prisma 需要）
RUN apk add --no-cache openssl1.1-compat libc6-compat

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建（如果使用 TypeScript）
RUN npm run build

# ========================================
# 阶段 2: 运行阶段
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

# 安装 OpenSSL 1.1 兼容库（Prisma 运行时需要）
RUN apk add --no-cache openssl1.1-compat libc6-compat

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 backend

# 创建数据目录
RUN mkdir -p /app/data && chown -R backend:nodejs /app/data

# 复制必要文件
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

# 复制视频资源
COPY --from=builder --chown=backend:nodejs /app/public ./public

# 设置环境变量
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/prod.db

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 切换到非 root 用户
USER backend

# 启动应用
CMD ["node", "dist/server.js"]
