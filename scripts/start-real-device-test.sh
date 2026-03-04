#!/bin/bash

# 自健身 App 真机测试启动脚本
# 创建时间: 2026-03-04

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
MOBILE_DIR="$PROJECT_ROOT/mobile"

echo "🦞 自健身 App - 真机测试启动"
echo "================================"
echo ""

# 检查 IP 地址
IP="172.16.21.187"
echo "📱 测试IP: $IP"
echo ""

# 启动后端
echo "🔧 启动后端服务..."
cd "$BACKEND_DIR"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    pnpm install
fi

# 检查数据库
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  初始化数据库..."
    pnpm prisma generate
    pnpm prisma migrate dev
    pnpm prisma db seed
fi

# 启动后端（后台运行）
echo "🚀 启动后端服务（端口: 3001）..."
pnpm dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if curl -s "http://localhost:3001/health" > /dev/null; then
    echo "✅ 后端服务启动成功！"
    echo "   访问: http://$IP:3001"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "📱 启动前端应用..."
cd "$MOBILE_DIR"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install
fi

echo ""
echo "================================"
echo "✅ 环境准备完成！"
echo ""
echo "📋 后续步骤："
echo ""
echo "1️⃣  在手机上安装 Expo Go："
echo "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2️⃣  启动 Expo（在新终端窗口运行）："
echo "   cd $MOBILE_DIR"
echo "   npx expo start"
echo ""
echo "3️⃣  用手机扫描二维码"
echo ""
echo "4️⃣  测试账号："
echo "   用户名: testuser"
echo "   密码: Test123456"
echo ""
echo "🔍 测试后端 API："
echo "   curl http://$IP:3001/health"
echo ""
echo "📖 详细文档："
echo "   $PROJECT_ROOT/docs/ANDROID_REAL_DEVICE_TEST.md"
echo ""
echo "================================"

# 保持后端运行
wait $BACKEND_PID
