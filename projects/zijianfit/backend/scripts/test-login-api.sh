#!/bin/bash

# 登录方式变更测试脚本
# 测试注册和登录API

API_URL="http://localhost:3001/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "======================================"
echo "登录方式变更测试"
echo "======================================"
echo ""

# 测试1: 注册API
echo -e "${YELLOW}测试1: 用户注册${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Test123456",
    "confirmPassword": "Test123456",
    "nickname": "测试用户"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# 检查是否注册成功
if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ 注册成功${NC}"
  TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
else
  echo -e "${RED}✗ 注册失败${NC}"
fi
echo ""

# 测试2: 用户名重复注册
echo -e "${YELLOW}测试2: 用户名重复注册${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Test123456",
    "confirmPassword": "Test123456"
  }')

echo "$DUPLICATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DUPLICATE_RESPONSE"
echo ""

if echo "$DUPLICATE_RESPONSE" | grep -q 'USERNAME_EXISTS'; then
  echo -e "${GREEN}✓ 正确拒绝重复用户名${NC}"
else
  echo -e "${RED}✗ 未正确处理重复用户名${NC}"
fi
echo ""

# 测试3: 登录API
echo -e "${YELLOW}测试3: 用户登录${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "Test123456"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ 登录成功${NC}"
else
  echo -e "${RED}✗ 登录失败${NC}"
fi
echo ""

# 测试4: 错误密码
echo -e "${YELLOW}测试4: 错误密码${NC}"
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "wrongpassword"
  }')

echo "$WRONG_PASSWORD_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WRONG_PASSWORD_RESPONSE"
echo ""

if echo "$WRONG_PASSWORD_RESPONSE" | grep -q 'PASSWORD_ERROR'; then
  echo -e "${GREEN}✓ 正确拒绝错误密码${NC}"
else
  echo -e "${RED}✗ 未正确处理错误密码${NC}"
fi
echo ""

# 测试5: 获取用户信息（需要认证）
if [ -n "$TOKEN" ]; then
  echo -e "${YELLOW}测试5: 获取用户信息${NC}"
  ME_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
  echo ""
  
  if echo "$ME_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ 获取用户信息成功${NC}"
  else
    echo -e "${RED}✗ 获取用户信息失败${NC}"
  fi
  echo ""
fi

echo "======================================"
echo -e "${GREEN}测试完成！${NC}"
echo "======================================"
