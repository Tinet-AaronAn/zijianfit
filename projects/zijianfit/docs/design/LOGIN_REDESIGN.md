# 登录/注册页面 UI 重设计

**设计日期**: 2026-03-03  
**设计师**: 宋绘（Design Agent）  
**变更原因**: 登录方式从微信登录改为用户名密码登录

---

## 1. 登录页面（LoginScreen）

### 1.1 页面布局

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         🏋️ 自健身                    │
│         YOUR FITNESS                │
│                                     │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 👤 用户名                  │   │
│    │ 请输入用户名               │   │
│    └───────────────────────────┘   │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 🔒 密码                    │   │
│    │ 请输入密码                 │   │
│    └───────────────────────────┘   │
│                                     │
│                                     │
│    ┌───────────────────────────┐   │
│    │        登  录              │   │
│    └───────────────────────────┘   │
│                                     │
│                                     │
│         没有账号？立即注册          │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 1.2 组件设计

#### Logo 区域
```typescript
<View style={styles.logoContainer}>
  <Text style={styles.logoText}>🏋️ 自健身</Text>
  <Text style={styles.logoSubtext}>YOUR FITNESS</Text>
</View>
```

#### 输入框组件
```typescript
// 用户名
<Input
  placeholder="请输入用户名"
  value={username}
  onChangeText={setUsername}
  leftIcon={<Icon name="user" size={20} color="#999" />}
  autoCapitalize="none"
  autoCorrect={false}
/>

// 密码
<Input
  placeholder="请输入密码"
  value={password}
  onChangeText={setPassword}
  leftIcon={<Icon name="lock" size={20} color="#999" />}
  secureTextEntry={!showPassword}
  rightIcon={
    <Icon 
      name={showPassword ? "eye-off" : "eye"} 
      size={20} 
      color="#999"
      onPress={() => setShowPassword(!showPassword)}
    />
  }
/>
```

#### 登录按钮
```typescript
<Button
  title="登录"
  onPress={handleLogin}
  loading={loading}
  disabled={!username || !password}
  buttonStyle={styles.loginButton}
  containerStyle={styles.buttonContainer}
/>
```

#### 注册链接
```typescript
<View style={styles.registerContainer}>
  <Text style={styles.registerText}>没有账号？</Text>
  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
    <Text style={styles.registerLink}>立即注册</Text>
  </TouchableOpacity>
</View>
```

### 1.3 样式规范

#### 颜色
```typescript
const colors = {
  primary: '#4CAF50',      // 主色调（绿色）
  secondary: '#2196F3',    // 次要色（蓝色）
  background: '#F5F5F5',   // 背景色
  text: '#333333',         // 文本色
  error: '#F44336',        // 错误色
  border: '#E0E0E0',       // 边框色
  placeholder: '#999999',  // 占位符色
};
```

#### 间距
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

#### 字体
```typescript
const fonts = {
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  input: {
    fontSize: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};
```

### 1.4 交互流程

```
开始
 ↓
输入用户名
 ↓
输入密码
 ├─ 可点击眼睛图标显示/隐藏密码
 ↓
点击"登录"按钮
 ├─ 验证：用户名不能为空
 ├─ 验证：密码不能为空
 ├─ 显示加载动画
 ├─ 调用登录API
 │   ├─ 成功 → 保存Token → 跳转首页
 │   └─ 失败 → 显示错误提示
 ↓
点击"立即注册" → 跳转注册页
```

### 1.5 错误提示

| 错误类型 | 提示文案 | 样式 |
|---------|---------|------|
| 用户名为空 | 请输入用户名 | Toast |
| 密码为空 | 请输入密码 | Toast |
| 用户不存在 | 用户不存在，请检查用户名 | Alert |
| 密码错误 | 密码错误，请重试 | Alert |
| 网络错误 | 网络异常，请检查网络连接 | Alert |
| 服务器错误 | 服务器异常，请稍后重试 | Alert |

---

## 2. 注册页面（RegisterScreen）

### 2.1 页面布局

```
┌─────────────────────────────────────┐
│         ← 返回                      │
│                                     │
│         创建账号                     │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 👤 用户名                  │   │
│    │ 4-20个字符，字母数字下划线  │   │
│    │                        ✓  │   │
│    └───────────────────────────┘   │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 🔒 密码                    │   │
│    │ 6-20个字符，至少包含字母   │   │
│    │                  中等 ⚡️  │   │
│    └───────────────────────────┘   │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 🔒 确认密码                │   │
│    │ 请再次输入密码             │   │
│    │                        ✓  │   │
│    └───────────────────────────┘   │
│                                     │
│    ┌───────────────────────────┐   │
│    │ 😊 昵称（可选）             │   │
│    │ 给自己起个名字吧           │   │
│    └───────────────────────────┘   │
│                                     │
│    ┌───────────────────────────┐   │
│    │        注  册              │   │
│    └───────────────────────────┘   │
│                                     │
│         已有账号？立即登录          │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 组件设计

#### 用户名输入框
```typescript
<Input
  placeholder="4-20个字符，字母数字下划线"
  value={username}
  onChangeText={setUsername}
  leftIcon={<Icon name="user" size={20} color="#999" />}
  rightIcon={
    usernameValid ? (
      <Icon name="check-circle" size={20} color="#4CAF50" />
    ) : null
  }
  errorMessage={usernameError}
  autoCapitalize="none"
  autoCorrect={false}
/>
```

#### 密码输入框（带强度提示）
```typescript
<View>
  <Input
    placeholder="6-20个字符，至少包含字母和数字"
    value={password}
    onChangeText={setPassword}
    leftIcon={<Icon name="lock" size={20} color="#999" />}
    rightIcon={
      <View style={styles.passwordStrength}>
        <Text>{passwordStrengthText}</Text>
        <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
      </View>
    }
    secureTextEntry={!showPassword}
    errorMessage={passwordError}
  />
  {password && (
    <View style={styles.strengthBar}>
      <View style={[styles.strengthFill, { width: passwordStrengthPercent }]} />
    </View>
  )}
</View>
```

#### 确认密码输入框
```typescript
<Input
  placeholder="请再次输入密码"
  value={confirmPassword}
  onChangeText={setConfirmPassword}
  leftIcon={<Icon name="lock" size={20} color="#999" />}
  rightIcon={
    confirmPassword && password === confirmPassword ? (
      <Icon name="check-circle" size={20} color="#4CAF50" />
    ) : confirmPassword && password !== confirmPassword ? (
      <Icon name="error" size={20} color="#F44336" />
    ) : null
  }
  errorMessage={
    confirmPassword && password !== confirmPassword 
      ? '两次密码不一致' 
      : ''
  }
  secureTextEntry={!showConfirmPassword}
/>
```

#### 昵称输入框（可选）
```typescript
<Input
  placeholder="给自己起个名字吧（可选）"
  value={nickname}
  onChangeText={setNickname}
  leftIcon={<Icon name="smile" size={20} color="#999" />}
  maxLength={20}
/>
```

### 2.3 验证逻辑

#### 用户名验证
```typescript
const validateUsername = (value: string) => {
  const regex = /^[a-zA-Z0-9_]{4,20}$/;
  
  if (!value) {
    setUsernameError('');
    setUsernameValid(false);
    return;
  }
  
  if (!regex.test(value)) {
    setUsernameError('用户名格式不正确');
    setUsernameValid(false);
  } else {
    setUsernameError('');
    setUsernameValid(true);
  }
};
```

#### 密码强度计算
```typescript
const calculatePasswordStrength = (pwd: string) => {
  let strength = 0;
  
  if (pwd.length >= 6) strength += 20;
  if (pwd.length >= 10) strength += 20;
  if (/[a-z]/.test(pwd)) strength += 20;
  if (/[A-Z]/.test(pwd)) strength += 20;
  if (/[0-9]/.test(pwd)) strength += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
  
  if (strength < 40) return { text: '弱', color: '#F44336', percent: '33%' };
  if (strength < 70) return { text: '中等', color: '#FF9800', percent: '66%' };
  return { text: '强', color: '#4CAF50', percent: '100%' };
};
```

#### 表单验证
```typescript
const validateForm = () => {
  if (!usernameValid) {
    Alert.alert('提示', '请输入有效的用户名');
    return false;
  }
  
  if (password.length < 6 || password.length > 20) {
    Alert.alert('提示', '密码长度应为6-20个字符');
    return false;
  }
  
  if (password !== confirmPassword) {
    Alert.alert('提示', '两次密码输入不一致');
    return false;
  }
  
  if (nickname && nickname.length > 20) {
    Alert.alert('提示', '昵称不能超过20个字符');
    return false;
  }
  
  return true;
};
```

### 2.4 交互流程

```
开始
 ↓
输入用户名
 ├─ 实时验证格式
 ├─ 显示✓或错误提示
 ↓
输入密码
 ├─ 实时显示强度
 ├─ 可显示/隐藏
 ↓
输入确认密码
 ├─ 实时对比是否一致
 ├─ 显示✓或✗
 ↓
输入昵称（可选）
 ├─ 限制20字符
 ↓
点击"注册"按钮
 ├─ 整体验证
 ├─ 显示加载动画
 ├─ 调用注册API
 │   ├─ 成功 → 保存Token → 跳转首页
 │   └─ 失败 → 显示错误提示
 ↓
点击"立即登录" → 跳转登录页
```

### 2.5 错误提示

| 错误类型 | 提示文案 | 样式 |
|---------|---------|------|
| 用户名格式错误 | 用户名格式不正确 | Input下方 |
| 用户名已存在 | 用户名已被使用，请换一个 | Alert |
| 密码格式错误 | 密码长度应为6-20个字符 | Alert |
| 密码不一致 | 两次密码输入不一致 | Input下方 |
| 昵称过长 | 昵称不能超过20个字符 | Alert |
| 网络错误 | 网络异常，请检查网络连接 | Alert |

---

## 3. 导航设计

### 3.1 路由配置

```typescript
// src/navigation/AuthNavigator.tsx
const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: '创建账号',
          headerBackTitle: '返回',
        }}
      />
    </AuthStack.Navigator>
  );
}
```

### 3.2 导航流程

```
LoginScreen
   ├─ 登录成功 → HomeScreen（MainNavigator）
   └─ 点击"立即注册" → RegisterScreen
        ├─ 注册成功 → HomeScreen（MainNavigator）
        └─ 点击"立即登录" → 返回LoginScreen
```

---

## 4. 状态管理

### 4.1 AuthStore 更新

```typescript
// src/stores/useAuthStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ username, password });
          set({ 
            user: response.data.user, 
            token: response.data.token,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          set({ 
            user: response.data.user, 
            token: response.data.token,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 5. 动画效果

### 5.1 Logo 动画
```typescript
const logoAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(logoAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

const logoStyle = {
  opacity: logoAnim,
  transform: [
    {
      translateY: logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 0],
      }),
    },
  ],
};
```

### 5.2 按钮加载动画
```typescript
{isLoading && (
  <ActivityIndicator 
    size="small" 
    color="#FFF" 
    style={{ marginRight: 8 }}
  />
)}
```

---

## 6. 响应式设计

### 6.1 键盘适配
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* 表单内容 */}
</KeyboardAvoidingView>
```

### 6.2 安全区域
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
  {/* 页面内容 */}
</SafeAreaView>
```

---

## 7. 无障碍设计

### 7.1 标签支持
```typescript
<Input
  accessibilityLabel="用户名输入框"
  accessibilityHint="请输入4-20个字符的用户名"
  // ...
/>

<Button
  accessibilityLabel="登录按钮"
  accessibilityRole="button"
  // ...
/>
```

### 7.2 字体缩放
```typescript
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();
const adjustedFontSize = baseFontSize * fontScale;
```

---

## 8. 测试要点

### 8.1 功能测试
- [ ] 用户名验证正确
- [ ] 密码强度显示正确
- [ ] 确认密码对比正确
- [ ] 登录成功跳转
- [ ] 注册成功跳转
- [ ] 错误提示友好

### 8.2 边界测试
- [ ] 用户名最短4字符
- [ ] 用户名最长20字符
- [ ] 密码最短6字符
- [ ] 密码最长20字符
- [ ] 昵称最长20字符
- [ ] 空输入验证

### 8.3 交互测试
- [ ] 键盘弹出时页面滚动
- [ ] 点击空白处键盘收起
- [ ] 回车键提交表单
- [ ] 加载状态显示
- [ ] 按钮禁用状态

---

**设计完成日期**: 2026-03-03  
**设计师**: 宋绘（Design Agent）  
**审核人**: 周衡（PM Agent）  
**执行人**: 行兵（Coding Agent）
