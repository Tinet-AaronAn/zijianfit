#!/bin/bash

# 健康检查脚本
# 用于监控后端服务状态

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
API_URL=${API_URL:-"http://localhost:3001"}
TIMEOUT=5

echo "======================================"
echo "自健身 Backend 健康检查"
echo "======================================"
echo ""

# 检查服务是否响应
check_health() {
    echo -e "${YELLOW}检查服务健康状态...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$API_URL/health")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ 服务运行正常 (HTTP $response)${NC}"
        
        # 显示详细信息
        health_info=$(curl -s --max-time $TIMEOUT "$API_URL/health")
        echo ""
        echo "$health_info" | python3 -m json.tool 2>/dev/null || echo "$health_info"
        return 0
    else
        echo -e "${RED}✗ 服务异常 (HTTP $response)${NC}"
        return 1
    fi
}

# 检查 API 文档
check_api() {
    echo ""
    echo -e "${YELLOW}检查 API 文档...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$API_URL/")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ API 文档可访问${NC}"
        
        # 显示端点信息
        api_info=$(curl -s --max-time $TIMEOUT "$API_URL/")
        echo ""
        echo "$api_info" | python3 -m json.tool 2>/dev/null || echo "$api_info"
        return 0
    else
        echo -e "${RED}✗ API 文档无法访问${NC}"
        return 1
    fi
}

# 检查数据库连接
check_database() {
    echo ""
    echo -e "${YELLOW}检查数据库连接...${NC}"
    
    # 通过 API 测试数据库（查询计划列表）
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$API_URL/api/plans/current")
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 404 ]; then
        echo -e "${GREEN}✓ 数据库连接正常${NC}"
        return 0
    else
        echo -e "${RED}✗ 数据库连接异常${NC}"
        return 1
    fi
}

# 检查认证接口
check_auth() {
    echo ""
    echo -e "${YELLOW}检查认证接口...${NC}"
    
    # 测试未认证请求
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        -X POST "$API_URL/api/auth/wechat" \
        -H "Content-Type: application/json")
    
    if [ "$response" -eq 400 ]; then
        echo -e "${GREEN}✓ 认证接口正常${NC}"
        return 0
    else
        echo -e "${RED}✗ 认证接口异常 (HTTP $response)${NC}"
        return 1
    fi
}

# 主检查流程
main() {
    all_passed=true
    
    check_health || all_passed=false
    check_api || all_passed=false
    check_database || all_passed=false
    check_auth || all_passed=false
    
    echo ""
    echo "======================================"
    
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}✓ 所有检查通过${NC}"
        echo "======================================"
        exit 0
    else
        echo -e "${RED}✗ 部分检查失败${NC}"
        echo "======================================"
        exit 1
    fi
}

# 运行检查
main
