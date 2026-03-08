import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, spacing, borderRadius } from '../constants';
import { useAuthStore } from '../stores/useAuthStore';
import api from '../services/api';

type Props = NativeStackScreenProps<any, 'Home'>;

interface WorkoutPlan {
  id: string;
  planId: string;
  dayOfWeek: number;
  dayName?: string;
  date?: string;
  isRestDay?: boolean;
  title: string;
  description?: string;
  label?: string;
  duration?: number;
  totalDuration?: number;
  exerciseCount?: number;
  exercises?: any[];
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [todayPlan, setTodayPlan] = useState<WorkoutPlan | null>(null);
  const [weeklyPlans, setWeeklyPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date().getDay();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/plans/current');
      if (response.success && response.data && response.data.days) {
        const plans = response.data.days;
        setWeeklyPlans(plans);
        
        // 找到今天的计划
        const todayPlan = plans.find((p: WorkoutPlan) => p.dayOfWeek === today);
        setTodayPlan(todayPlan || null);
      }
    } catch (error) {
      console.error('加载训练计划失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 顶部欢迎 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>你好，</Text>
          <Text style={styles.userName}>{user?.nickname || user?.username || '健身爱好者'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出</Text>
        </TouchableOpacity>
      </View>

      {/* 今日训练 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 今日训练</Text>
        {todayPlan ? (
          <TouchableOpacity
            style={styles.todayCard}
            onPress={() => navigation.navigate('WorkoutDetail', { 
              planId: todayPlan.planId,
              dayOfWeek: todayPlan.dayOfWeek 
            })}
          >
            <View style={styles.todayCardContent}>
              <Text style={styles.todayTitle}>{todayPlan.title}</Text>
              <Text style={styles.todayDescription}>{todayPlan.description}</Text>
              <View style={styles.todayMeta}>
                <Text style={styles.todayMetaText}>⏱️ {todayPlan.totalDuration || todayPlan.duration || 0}分钟</Text>
                <Text style={styles.todayMetaText}>
                  💪 {todayPlan.exerciseCount || todayPlan.exercises?.length || 0}个动作
                </Text>
              </View>
            </View>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>开始训练 →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.restCard}>
            <Text style={styles.restEmoji}>😴</Text>
            <Text style={styles.restTitle}>今天是休息日</Text>
            <Text style={styles.restDescription}>好好休息，明天继续加油！</Text>
          </View>
        )}
      </View>

      {/* 本周计划 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📆 本周计划</Text>
        <View style={styles.weekGrid}>
          {weeklyPlans.map((plan, index) => (
            <TouchableOpacity
              key={plan.id || index}
              style={[
                styles.dayCard,
                plan.dayOfWeek === today && styles.dayCardToday,
              ]}
              onPress={() => navigation.navigate('WorkoutDetail', { 
                planId: plan.planId,
                dayOfWeek: plan.dayOfWeek 
              })}
            >
              <Text
                style={[
                  styles.dayName,
                  plan.dayOfWeek === today && styles.dayNameToday,
                ]}
              >
                {dayNames[plan.dayOfWeek]}
              </Text>
              <View
                style={[
                  styles.dayIndicator,
                  plan.dayOfWeek === today && styles.dayIndicatorToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayIndicatorText,
                    plan.dayOfWeek === today && styles.dayIndicatorTextToday,
                  ]}
                >
                  {plan.exerciseCount || plan.exercises?.length || 0}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 快捷入口 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 快捷入口</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionTitle}>训练统计</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => {}}
          >
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionTitle}>训练目标</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.base,
    color: colors.error,
    fontWeight: '600',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  todayCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayCardContent: {
    flex: 1,
  },
  todayTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  todayDescription: {
    fontSize: fontSize.base,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  todayMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  todayMetaText: {
    fontSize: fontSize.sm,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  startButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  restCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  restEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  restTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  restDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  dayCard: {
    width: 42,
    height: 56,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardToday: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  dayNameToday: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayIndicatorToday: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayIndicatorText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dayIndicatorTextToday: {
    color: colors.text.inverse,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
});

export default HomeScreen;
