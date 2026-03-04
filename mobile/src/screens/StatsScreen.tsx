import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, spacing, borderRadius } from '../constants';
import api from '../services/api';

type Props = NativeStackScreenProps<any, 'Stats'>;

interface WeeklyStats {
  totalWorkouts: number;
  totalDuration: number;
  totalExercises: number;
  completedDays: number;
}

interface DailyStats {
  date: string;
  duration: number;
  exercises: number;
  completed: boolean;
}

const StatsScreen: React.FC<Props> = () => {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // TODO: 替换为实际的API调用
      // const response = await api.get('/stats/weekly');
      
      // 模拟数据
      const mockWeeklyStats: WeeklyStats = {
        totalWorkouts: 5,
        totalDuration: 150,
        totalExercises: 26,
        completedDays: 5,
      };

      const mockDailyStats: DailyStats[] = [
        { date: '2026-03-02', duration: 30, exercises: 5, completed: true },
        { date: '2026-03-03', duration: 0, exercises: 0, completed: false },
        { date: '2026-03-04', duration: 30, exercises: 5, completed: true },
      ];

      setWeeklyStats(mockWeeklyStats);
      setDailyStats(mockDailyStats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
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
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>训练统计</Text>
        <Text style={styles.headerSubtitle}>本周数据</Text>
      </View>

      {/* 本周概览 */}
      {weeklyStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 本周概览</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>💪</Text>
              <Text style={styles.statValue}>{weeklyStats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>训练次数</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statValue}>{weeklyStats.totalDuration}</Text>
              <Text style={styles.statLabel}>总时长(分钟)</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statValue}>{weeklyStats.totalExercises}</Text>
              <Text style={styles.statLabel}>完成动作</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📅</Text>
              <Text style={styles.statValue}>{weeklyStats.completedDays}</Text>
              <Text style={styles.statLabel}>训练天数</Text>
            </View>
          </View>
        </View>
      )}

      {/* 本周训练日历 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📆 训练日历</Text>
        <View style={styles.calendarGrid}>
          {dayNames.map((day, index) => {
            const isToday = new Date().getDay() === index;
            const dayStat = dailyStats.find(s => new Date(s.date).getDay() === index);
            const isCompleted = dayStat?.completed || false;

            return (
              <View
                key={day}
                style={[
                  styles.calendarDay,
                  isToday && styles.calendarDayToday,
                  isCompleted && styles.calendarDayCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayName,
                    isToday && styles.calendarDayNameToday,
                  ]}
                >
                  {day}
                </Text>
                {isCompleted && (
                  <View style={styles.completedIndicator}>
                    <Text style={styles.completedIndicatorText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 训练记录 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 最近训练</Text>
        {dailyStats.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🏃</Text>
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>开始你的第一次训练吧！</Text>
          </View>
        ) : (
          dailyStats.map((stat, index) => (
            <View key={index} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>
                  {new Date(stat.date).toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}
                </Text>
                {stat.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>已完成</Text>
                  </View>
                )}
              </View>
              <View style={styles.recordStats}>
                <View style={styles.recordStat}>
                  <Text style={styles.recordStatValue}>{stat.duration}</Text>
                  <Text style={styles.recordStatLabel}>分钟</Text>
                </View>
                <View style={styles.recordStatDivider} />
                <View style={styles.recordStat}>
                  <Text style={styles.recordStatValue}>{stat.exercises}</Text>
                  <Text style={styles.recordStatLabel}>动作</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* 目标进度 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 目标进度</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>每周训练5天</Text>
            <Text style={styles.goalProgress}>
              {weeklyStats?.completedDays || 0}/7
            </Text>
          </View>
          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                {
                  width: `${((weeklyStats?.completedDays || 0) / 7) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.goalSubtext}>
            还差{7 - (weeklyStats?.completedDays || 0)}天就达成目标了！
          </Text>
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
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  calendarDay: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarDayToday: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  calendarDayCompleted: {
    backgroundColor: `${colors.success}20`,
    borderColor: colors.success,
  },
  calendarDayName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  calendarDayNameToday: {
    color: colors.primary,
  },
  completedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  completedIndicatorText: {
    fontSize: 10,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  recordCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recordDate: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  completedBadge: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  completedBadgeText: {
    fontSize: fontSize.xs,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordStat: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  recordStatValue: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.primary,
  },
  recordStatLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  recordStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  goalProgress: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  goalProgressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  goalSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default StatsScreen;
