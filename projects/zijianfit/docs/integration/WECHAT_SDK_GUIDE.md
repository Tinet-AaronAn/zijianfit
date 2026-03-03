# 微信SDK集成指南

> 本文档指导如何在自健身 App（React Native）中集成微信登录功能

## 目录

- [1. 微信开放平台账号申请](#1-微信开放平台账号申请)
- [2. 创建移动应用](#2-创建移动应用)
- [3. 获取关键信息](#3-获取关键信息)
- [4. 前端集成（React Native）](#4-前端集成react-native)
- [5. 代码实现](#5-代码实现)
- [6. 后端配置](#6-后端配置)
- [7. 测试验证](#7-测试验证)
- [8. 安全注意事项](#8-安全注意事项)
- [9. 常见问题](#9-常见问题)

---

## 1. 微信开放平台账号申请

### 1.1 访问开放平台

访问微信开放平台：https://open.weixin.qq.com/

### 1.2 注册流程

#### 个人开发者
1. 使用邮箱注册账号
2. 完成邮箱验证
3. 填写个人身份信息
4. **费用：免费**

#### 企业开发者
1. 使用企业邮箱注册
2. 完成邮箱验证
3. 填写企业信息（营业执照、组织机构代码等）
4. **费用：300元/年**

### 1.3 开发者资质认证

- **个人账号**：无需额外认证，可直接创建应用
- **企业账号**：需要提交企业资质审核（1-3个工作日）

> **建议**：如果是个人项目，建议使用个人开发者账号，可以节省认证费用

---

## 2. 创建移动应用

### 2.1 进入管理中心

登录后，进入 **管理中心 → 移动应用 → 创建移动应用**

### 2.2 填写应用信息

#### 基本信息
- **应用名称**：自健身
- **应用简介**：面向家庭健身用户的健身计划管理工具
- **应用官网**：待定（可填写个人网站或GitHub页面）

#### 应用图标
需要准备两张图标：
- **小图标**：28x28 像素（PNG格式，透明背景）
- **大图标**：108x108 像素（PNG格式，透明背景）

> **提示**：图标设计建议使用简约风格，避免过多细节

### 2.3 提交审核

填写完成后提交审核，审核周期：**1-3 个工作日**

审核状态会通过邮件通知。

---

## 3. 获取关键信息

### 3.1 审核通过后获取

审核通过后，在应用详情页面可以获取以下关键信息：

| 信息 | 说明 | 重要性 |
|------|------|--------|
| **AppID** | 应用唯一标识 | ⭐⭐⭐ 必需 |
| **AppSecret** | 应用密钥 | ⭐⭐⭐ 绝密 |
| **应用签名** | Android应用签名 | ⭐⭐ Android必需 |
| **Bundle ID** | iOS应用标识 | ⭐⭐ iOS必需 |

### 3.2 Android应用签名获取

#### 方法1：使用签名工具
```bash
# 下载微信提供的签名获取工具
# 安装到手机后，输入包名即可获取
```

#### 方法2：命令行获取
```bash
# debug签名
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# release签名
keytool -list -v -keystore your-release-key.keystore -alias your-alias
```

> **重要**：签名信息需要与打包时使用的签名一致，否则无法正常使用微信功能

### 3.3 iOS Bundle ID

在Xcode项目中查看：
```
项目 TARGETS → General → Bundle Identifier
```

通常格式为：`com.yourcompany.zijianfit`

---

## 4. 前端集成（React Native）

### 4.1 安装依赖

```bash
# 使用 npm
npm install react-native-wechat-lib

# 或使用 yarn
yarn add react-native-wechat-lib
```

### 4.2 iOS 配置

#### 步骤1：修改 Info.plist

在 `ios/<项目名>/Info.plist` 中添加：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- 现有配置... -->
    
    <!-- 添加微信URL Scheme白名单 -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>weixin</string>
        <string>weixinULAPI</string>
    </array>
    
    <!-- 添加微信URL Scheme -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLName</key>
            <string>weixin</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>你的AppID</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

#### 步骤2：修改 Podfile

在 `ios/Podfile` 中添加：

```ruby
target 'zijianfit' do
  # 现有依赖...
  
  # 微信SDK
  pod 'RCTWeChat', :path => '../node_modules/react-native-wechat-lib'
end
```

#### 步骤3：安装 Pods

```bash
cd ios
pod install
cd ..
```

#### 步骤4：配置 AppDelegate（可选）

如果需要处理微信回调，在 `AppDelegate.m` 中添加：

```objective-c
#import <React/RCTLinkingManager.h>

// iOS 9.0+
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// iOS 8.0及更早版本
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
  return [RCTLinkingManager application:application
                                openURL:url
                      sourceApplication:sourceApplication
                             annotation:annotation];
}
```

### 4.3 Android 配置

#### 步骤1：修改 build.gradle

在 `android/app/build.gradle` 中添加：

```gradle
android {
    // 现有配置...
    
    defaultConfig {
        // 现有配置...
        
        // 微信配置
        manifestPlaceholders = [
            WECHAT_APPID: "你的AppID"
        ]
    }
}
```

#### 步骤2：修改 AndroidManifest.xml

在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zijianfit">

    <!-- 添加网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <!-- 现有配置... -->
        
        <!-- 微信回调Activity -->
        <activity
            android:name=".wxapi.WXEntryActivity"
            android:label="@string/app_name"
            android:exported="true"
            android:launchMode="singleTask"
            android:taskAffinity="com.zijianfit"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">
        </activity>
        
    </application>
</manifest>
```

#### 步骤3：创建 WXEntryActivity

创建文件：`android/app/src/main/java/com/zijianfit/wxapi/WXEntryActivity.java`

```java
package com.zijianfit.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.theweflex.react.WechatPackage;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WechatPackage.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq req) {
        // 微信发送的请求，一般不需要处理
    }

    @Override
    public void onResp(BaseResp resp) {
        // 微信返回的响应，SDK会自动处理
    }
}
```

> **重要**：包名必须与你的应用包名一致，否则无法正常回调

---

## 5. 代码实现

### 5.1 初始化 SDK

在 `App.tsx` 中初始化：

```typescript
import React, { useEffect } from 'react';
import { WeChat } from 'react-native-wechat-lib';

const App: React.FC = () => {
  useEffect(() => {
    // 初始化微信SDK
    const initWeChat = async () => {
      try {
        const appId = '你的AppID'; // 从环境变量或配置文件读取
        await WeChat.registerApp(appId);
        console.log('微信SDK初始化成功');
      } catch (error) {
        console.error('微信SDK初始化失败:', error);
      }
    };

    initWeChat();
  }, []);

  // 应用其他代码...
  return (
    // JSX
  );
};

export default App;
```

### 5.2 登录实现

创建 `src/screens/LoginScreen.tsx`：

```typescript
import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { WeChat } from 'react-native-wechat-lib';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const login = useAuthStore(state => state.login);

  const handleWeChatLogin = async () => {
    try {
      // 1. 检查微信是否安装
      const isWXAppInstalled = await WeChat.isWXAppInstalled();
      if (!isWXAppInstalled) {
        Alert.alert('提示', '请先安装微信');
        return;
      }

      // 2. 发起微信授权请求
      const result = await WeChat.sendAuthRequest(
        'snsapi_userinfo',  // 作用域：获取用户信息
        'random_state_string'  // 自定义状态参数
      );

      // 3. 处理授权结果
      if (result.errCode === 0) {
        // 获取授权code
        const code = result.code;
        
        // 4. 发送到后端换取token
        const response = await authService.wechatLogin(code);
        
        // 5. 保存登录状态
        login(response.data.user, response.data.token);
        
        // 6. 跳转到首页
        navigation.navigate('Home' as never);
        
        Alert.alert('登录成功', `欢迎，${response.data.user.nickname}`);
      } else {
        Alert.alert('授权失败', `错误码：${result.errCode}`);
      }
    } catch (error: any) {
      console.error('微信登录失败:', error);
      Alert.alert('登录失败', error.message || '请重试');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="微信登录"
        onPress={handleWeChatLogin}
        color="#07C160"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
```

### 5.3 手机号授权（可选）

```typescript
import { WeChat } from 'react-native-wechat-lib';
import { authService } from '../services/authService';

/**
 * 获取微信绑定的手机号
 * 注意：需要微信开放平台认证，且需要申请手机号权限
 */
export const getWeChatPhoneNumber = async () => {
  try {
    // 1. 检查微信是否安装
    const isWXAppInstalled = await WeChat.isWXAppInstalled();
    if (!isWXAppInstalled) {
      throw new Error('请先安装微信');
    }

    // 2. 获取手机号授权
    const result = await WeChat.getPhoneNumber();
    
    if (result.errCode === 0) {
      const { encryptedData, iv } = result;
      
      // 3. 发送到后端解密
      const response = await authService.bindPhone(encryptedData, iv);
      
      return response.data.phoneNumber;
    } else {
      throw new Error(`获取手机号失败：${result.errStr}`);
    }
  } catch (error) {
    console.error('获取手机号失败:', error);
    throw error;
  }
};
```

### 5.4 退出登录

```typescript
import { useAuthStore } from '../stores/authStore';

const useLogout = () => {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    try {
      // 清除本地存储的token和用户信息
      logout();
      
      // 可选：调用后端登出接口
      await authService.logout();
      
      // 跳转到登录页
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return handleLogout;
};
```

---

## 6. 后端配置

### 6.1 环境变量

在 `backend/.env` 中添加：

```bash
# 微信配置（从微信开放平台获取）
WECHAT_APPID=wx1234567890abcdef
WECHAT_APPSECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# 微信API地址（一般不需要修改）
WECHAT_API_URL=https://api.weixin.qq.com
```

### 6.2 后端接口实现

微信登录接口已在 `backend/src/controllers/auth.controller.ts` 中实现，主要流程：

1. 接收前端传来的授权code
2. 调用微信API换取access_token
3. 获取微信用户信息
4. 创建或更新本地用户
5. 生成JWT token返回给前端

### 6.3 测试接口

```bash
# 测试微信登录接口
curl -X POST http://localhost:3001/api/auth/wechat/login \
  -H "Content-Type: application/json" \
  -d '{"code": "your_wechat_code"}'
```

---

## 7. 测试验证

### 7.1 测试清单

完成集成后，按以下清单逐项测试：

- [ ] **微信安装检测**
  - 安装微信时：应返回true
  - 未安装微信时：应返回false并提示用户

- [ ] **微信授权页面跳转**
  - 点击登录按钮：应跳转到微信授权页面
  - 显示应用名称和权限说明

- [ ] **授权成功后返回App**
  - 点击同意授权：应自动返回应用
  - 获取到授权code

- [ ] **获取用户信息**
  - 后端成功换取access_token
  - 获取到用户昵称、头像等信息

- [ ] **手机号授权**（如需要）
  - 显示手机号授权弹窗
  - 成功获取并解密手机号

- [ ] **Token保存和刷新**
  - Token正确保存到本地存储
  - Token过期后自动刷新

- [ ] **退出登录**
  - 清除本地Token
  - 跳转到登录页

### 7.2 测试环境

#### iOS测试
- 需要真机测试（模拟器无法安装微信）
- 需要配置开发者证书

#### Android测试
- 真机或模拟器均可
- 需要安装微信客户端

---

## 8. 安全注意事项

### 8.1 AppSecret保护

#### ❌ 禁止操作
```typescript
// ❌ 不要写在前端代码中
const APP_SECRET = 'a1b2c3d4e5f6g7h8'; // 危险！

// ❌ 不要提交到Git
// .env文件应该被.gitignore忽略
```

#### ✅ 正确做法
```typescript
// ✅ 使用环境变量（仅后端）
const appSecret = process.env.WECHAT_APPSECRET;

// ✅ 前端只使用AppID
const appId = Config.WECHAT_APPID; // AppID可以公开
```

### 8.2 Token管理

#### JWT Token配置
```typescript
// 建议配置
const TOKEN_CONFIG = {
  expiresIn: '7d',           // Token有效期：7天
  refreshExpiresIn: '30d',    // Refresh Token有效期：30天
  algorithm: 'HS256',         // 加密算法
};
```

#### Token刷新机制
```typescript
// 前端：Token过期自动刷新
const refreshToken = async () => {
  try {
    const refreshToken = await storage.get('refreshToken');
    const response = await authService.refresh(refreshToken);
    
    // 更新token
    await storage.set('token', response.data.token);
    await storage.set('refreshToken', response.data.refreshToken);
    
    return response.data.token;
  } catch (error) {
    // Refresh token也过期，跳转到登录页
    navigation.navigate('Login');
  }
};
```

### 8.3 HTTPS要求

- ✅ 生产环境必须使用HTTPS
- ✅ 后端API必须启用SSL证书
- ✅ 防止中间人攻击

### 8.4 密钥轮换

建议定期轮换AppSecret：
1. 在微信开放平台重新生成AppSecret
2. 更新后端环境变量
3. 部署新版本
4. 观察是否正常工作

---

## 9. 常见问题

### 9.1 微信授权页面不弹出

**原因**：
- AppID配置错误
- 应用签名不匹配（Android）
- Bundle ID不匹配（iOS）

**解决方案**：
```bash
# 1. 检查AppID是否正确
console.log('AppID:', Config.WECHAT_APPID);

# 2. Android：重新获取应用签名
keytool -list -v -keystore your-keystore

# 3. iOS：检查Bundle ID
# Xcode → TARGETS → General → Bundle Identifier
```

### 9.2 授权后不返回App

**原因**：
- URL Scheme配置错误（iOS）
- WXEntryActivity配置错误（Android）

**解决方案**：

#### iOS检查
```xml
<!-- Info.plist -->
<key>CFBundleURLSchemes</key>
<array>
    <string>你的AppID</string> <!-- 必须与微信开放平台一致 -->
</array>
```

#### Android检查
- WXEntryActivity包名是否正确
- Activity是否在AndroidManifest.xml中注册

### 9.3 获取手机号失败

**原因**：
- 未完成微信开放平台认证
- 未申请手机号权限

**解决方案**：
1. 完成企业认证（个人账号无法使用此功能）
2. 在微信开放平台申请获取手机号权限
3. 等待审核通过

### 9.4 code无效或已过期

**原因**：
- code只能使用一次
- code有效期5分钟

**解决方案**：
- 确保code只发送到后端一次
- 获取code后立即使用

### 9.5 编译错误：找不到WeChat模块

**iOS解决方案**：
```bash
cd ios
pod install
cd ..
npm start -- --reset-cache
```

**Android解决方案**：
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### 9.6 调试技巧

#### 查看微信SDK日志
```typescript
// 开启调试模式
WeChat.openWXApp({
  debug: true
});
```

#### 查看网络请求
使用React Native Debugger或Flipper查看网络请求和响应

---

## 附录

### A. 参考链接

- [微信开放平台](https://open.weixin.qq.com/)
- [react-native-wechat-lib文档](https://github.com/little-snow-fox/react-native-wechat-lib)
- [微信登录接入指南](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html)

### B. 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2024-03-03 | 1.0.0 | 初始版本 |

### C. 联系方式

如有问题，请联系：
- 技术负责人：安老师
- 文档维护：开发团队

---

**文档最后更新时间**：2024-03-03
