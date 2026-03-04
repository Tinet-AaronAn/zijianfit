import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, spacing, borderRadius } from '../constants';
import { useAuthStore } from '../stores/useAuthStore';

type Props = NativeStackScreenProps<any, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuthStore();

  // 密码强度计算
  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (pwd.length < 6) return 'weak';

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

    if (strength <= 1) return 'weak';
    if (strength <= 2) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleRegister = async () => {
    // 验证
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('提示', '请填写所有必填项');
      return;
    }

    if (username.length < 4 || username.length > 20) {
      Alert.alert('提示', '用户名长度应为4-20个字符');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert('提示', '用户名只能包含字母、数字和下划线');
      return;
    }

    if (password.length < 6 || password.length > 20) {
      Alert.alert('提示', '密码长度应为6-20个字符');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      Alert.alert('提示', '密码必须包含字母和数字');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    try {
      await register({
        username,
        password,
        confirmPassword,
        nickname: nickname || undefined,
      });
      Alert.alert('成功', '注册成功！', [
        { text: '确定', onPress: () => {} }
      ]);
    } catch (error: any) {
      Alert.alert('注册失败', error.message || '请稍后重试');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>创建账号</Text>
        <Text style={styles.subtitle}>加入自健身，开启健康生活</Text>

        <View style={styles.form}>
          {/* 用户名 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>用户名 *</Text>
            <TextInput
              style={styles.input}
              placeholder="4-20个字符，字母数字下划线"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
          </View>

          {/* 昵称 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>昵称（可选）</Text>
            <TextInput
              style={styles.input}
              placeholder="给自己起个名字"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />
          </View>

          {/* 密码 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>密码 *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="6-20个字符，需包含字母和数字"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                maxLength={20}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View
                  style={[
                    styles.strengthBar,
                    passwordStrength === 'weak' && styles.strengthBarWeak,
                    passwordStrength === 'medium' && styles.strengthBarMedium,
                    passwordStrength === 'strong' && styles.strengthBarStrong,
                  ]}
                />
                <Text
                  style={[
                    styles.strengthText,
                    passwordStrength === 'weak' && styles.strengthTextWeak,
                    passwordStrength === 'medium' && styles.strengthTextMedium,
                    passwordStrength === 'strong' && styles.strengthTextStrong,
                  ]}
                >
                  {passwordStrength === 'weak' && '弱'}
                  {passwordStrength === 'medium' && '中等'}
                  {passwordStrength === 'strong' && '强'}
                </Text>
              </View>
            )}
          </View>

          {/* 确认密码 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>确认密码 *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="再次输入密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                maxLength={20}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && (
              <Text
                style={[
                  styles.matchText,
                  passwordsMatch ? styles.matchTextSuccess : styles.matchTextError,
                ]}
              >
                {passwordsMatch ? '✓ 密码一致' : '✗ 密码不一致'}
              </Text>
            )}
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (isLoading || !username || !password || !confirmPassword || !passwordsMatch) &&
                styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading || !username || !password || !confirmPassword || !passwordsMatch}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={styles.registerButtonText}>注册</Text>
            )}
          </TouchableOpacity>

          {/* 登录链接 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>已有账号？</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>立即登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  eyeButton: {
    padding: spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.disabled,
  },
  strengthBarWeak: {
    backgroundColor: colors.error,
    width: '33%',
  },
  strengthBarMedium: {
    backgroundColor: colors.warning,
    width: '66%',
  },
  strengthBarStrong: {
    backgroundColor: colors.success,
  },
  strengthText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
  },
  strengthTextWeak: {
    color: colors.error,
  },
  strengthTextMedium: {
    color: colors.warning,
  },
  strengthTextStrong: {
    color: colors.success,
  },
  matchText: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  matchTextSuccess: {
    color: colors.success,
  },
  matchTextError: {
    color: colors.error,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  registerButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});

export default RegisterScreen;
