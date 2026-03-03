#!/bin/bash

# 自健身 Backend 启动脚本
# 支持开发和生产环境

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 切换到项目目录
cd "$PROJECT_DIR"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}自健身 Backend 启动脚本${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}未找到依赖，开始安装...${NC}"
    npm install
    echo ""
fi

# 检查环境文件
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}未找到 .env 文件，从模板创建...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ 已创建 .env 文件${NC}"
        echo -e "${YELLOW}请编辑 .env 文件配置必要参数${NC}"
    else
        echo -e "${RED}错误: 未找到 .env 或 .env.example${NC}"
        exit 1
    fi
    echo ""
fi

# 检查数据库
echo -e "${YELLOW}检查数据库...${NC}"
if [ ! -f "prisma/dev.db" ]; then
    echo -e "${YELLOW}数据库不存在，开始初始化...${NC}"
    npx prisma generate
    npx prisma migrate dev
    npm run prisma:seed
    echo -e "${GREEN}✓ 数据库初始化完成${NC}"
else
    echo -e "${GREEN}✓ 数据库已存在${NC}"
fi
echo ""

# 运行测试
echo -e "${YELLOW}运行测试...${NC}"
npm test
if [ $? -ne 0 ]; then
    echo -e "${RED}测试失败，请修复后再启动${NC}"
    read -p "是否继续启动？ (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# 选择环境
echo "请选择启动环境:"
echo "1) 开发环境 (development)"
echo "2) 生产环境 (production)"
echo ""
read -p "输入选项 (1-2): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo -e "${GREEN}启动开发环境...${NC}"
        npm run dev
        ;;
    2)
        echo -e "${GREEN}启动生产环境...${NC}"
        # 检查 PM2
        if command -v pm2 &> /dev/null; then
            echo -e "${GREEN}使用 PM2 启动...${NC}"
            pm2 start npm --name "zijianfit-backend" -- run start:prod
            pm2 logs zijianfit-backend
        else
            echo -e "${YELLOW}未找到 PM2，直接启动...${NC}"
            npm run start:prod
        fi
        ;;
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac
