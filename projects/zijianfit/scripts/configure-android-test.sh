#!/bin/bash

# Android 真机测试配置脚本
# 使用方法: bash scripts/configure-android-test.sh <YOUR_COMPUTER_IP>

if [ -z "$1" ]; then
  echo "错误: 缺少参数"
  echo "使用方法: bash scripts/configure-android-test.sh 192.168.1.100"
  exit 1
fi

COMPUTER_IP=$1
BACKEND_PORT=3001
API_URL="http://${COMPUTER_IP}:${BACKEND_PORT}/api"

echo "======================================"
echo "Android 真机测试配置"
echo "======================================"
echo ""
echo "电脑 IP: $COMPUTER_IP"
echo "后端端口: $BACKEND_PORT"
echo "API 地址: $API_URL"
echo ""

# 1. 更新前端 API 配置
echo "1️⃣ 更新前端 API 配置..."
MOBILE_DIR="projects/zijianfit/mobile"
API_FILE="${MOBILE_DIR}/src/services/api.ts"

if [ -f "$API_FILE" ]; then
  # macOS 和 Linux 的 sed 命令不同
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|const API_BASE_URL.*|const API_BASE_URL = '$API_URL';|g" "$API_FILE"
  else
    # Linux
    sed -i "s|const API_BASE_URL.*|const API_BASE_URL = '$API_URL';|g" "$API_FILE"
  fi
  echo "✅ 前端 API 配置已更新"
else
  echo "⚠️  文件不存在: $API_FILE"
fi

# 2. 更新后端 CORS 配置
echo ""
echo "2️⃣ 更新后端 CORS 配置..."
BACKEND_DIR="projects/zijianfit/backend"
ENV_FILE="${BACKEND_DIR}/.env"

if [ -f "$ENV_FILE" ]; then
  # 检查是否已有 CORS_ORIGIN
  if grep -q "CORS_ORIGIN" "$ENV_FILE"; then
    # 更新现有配置
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|CORS_ORIGIN.*|CORS_ORIGIN=http://${COMPUTER_IP}:${BACKEND_PORT}|g" "$ENV_FILE"
    else
      sed -i "s|CORS_ORIGIN.*|CORS_ORIGIN=http://${COMPUTER_IP}:${BACKEND_PORT}|g" "$ENV_FILE"
    fi
  else
    # 添加新配置
    echo "CORS_ORIGIN=http://${COMPUTER_IP}:${BACKEND_PORT}" >> "$ENV_FILE"
  fi
  echo "✅ 后端 CORS 配置已更新"
else
  # 创建 .env 文件
  cat > "$ENV_FILE" << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL=file:./dev.db
JWT_SECRET=dev_jwt_secret_key_123456
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://${COMPUTER_IP}:${BACKEND_PORT}
EOF
  echo "✅ 后端 .env 文件已创建"
fi

# 3. 创建测试配置文件
echo ""
echo "3️⃣ 创建测试配置文件..."
TEST_CONFIG="projects/zijianfit/.test-config"
cat > "$TEST_CONFIG" << EOF
# 测试配置
# 最后更新: $(date)

COMPUTER_IP=${COMPUTER_IP}
BACKEND_PORT=${BACKEND_PORT}
API_URL=${API_URL}

# 后端启动命令
cd projects/zijianfit/backend && npm run dev

# 前端启动命令（Android）
cd projects/zijianfit/mobile && npm run android

# 测试API
curl http://${COMPUTER_IP}:${BACKEND_PORT}/health
EOF

echo "✅ 测试配置文件已创建: $TEST_CONFIG"

echo ""
echo "======================================"
echo "✅ 配置完成！"
echo "======================================"
echo ""
echo "下一步操作："
echo ""
echo "1. 启动后端："
echo "   cd projects/zijianfit/backend && npm run dev"
echo ""
echo "2. 新开终端，启动前端："
echo "   cd projects/zijianfit/mobile && npm run android"
echo ""
echo "3. 在手机上测试 App"
echo ""
