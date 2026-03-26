import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Video from 'react-native-video';
import { colors, fontSize, spacing, borderRadius } from '../constants';
import api from '../services/api';

// 获取完整的视频URL
const getVideoUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  // 本地视频路径以 /videos/ 开头
  if (path.startsWith('/videos/')) {
    // 模拟器访问主机需要使用 10.0.2.2
    // 真机需要使用实际 IP
    const host = '10.0.2.2'; // 模拟器专用
    return `http://${host}:3001${path}`;
  }
  // 其他情况返回原路径（如B站链接）
  return path;
};

type Props = NativeStackScreenProps<any, 'WorkoutDetail'>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  videoUrl?: string;
  sets?: number;
  reps?: number;
}

interface WorkoutPlan {
  id: string;
  dayOfWeek: number;
  title: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

const WorkoutDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { planId, dayOfWeek } = route.params as { planId: string; dayOfWeek: number };
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    loadPlan();
  }, [planId, dayOfWeek]);

  const loadPlan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/plans/${planId}/days/${dayOfWeek}`);
      if (response.success) {
        setPlan(response.data);
      }
    } catch (error) {
      console.error('加载训练计划失败:', error);
      Alert.alert('错误', '加载训练计划失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowWorkout = () => {
    if (!plan) return;

    // 判断训练类型和分类
    const hasStrengthExercises = plan.exercises.some(e => e.type === 'strength');
    const hasCardioExercises = plan.exercises.some(e => e.type === 'cardio');

    // 根据训练日判断训练分类
    let workoutCategory: 'upper-body' | 'lower-body' | 'cardio' | undefined;
    let videoUrl: string | undefined;
    let targetRounds = 1;

    // 周一：上肢力量 + 慢跑
    if (plan.dayOfWeek === 1) {
      workoutCategory = 'upper-body';
      videoUrl = '/videos/upper-body.mp4';
      targetRounds = 3;
    }
    // 周三：下肢力量 + 慢跑
    else if (plan.dayOfWeek === 3) {
      workoutCategory = 'lower-body';
      videoUrl = '/videos/lower-body.mp4';
      targetRounds = 3;
    }
    // 周五：间歇跑（纯有氧）
    else if (plan.dayOfWeek === 5) {
      workoutCategory = 'cardio';
      videoUrl = undefined;
      targetRounds = 1;
    }
    // 周日：全身循环训练
    else if (plan.dayOfWeek === 7) {
      workoutCategory = 'upper-body'; // 使用上肢视频
      videoUrl = '/videos/upper-body.mp4';
      targetRounds = 4;
    }

    navigation.navigate('FollowWorkout', {
      id: plan.id,
      planId: plan.id,
      dayOfWeek: plan.dayOfWeek,
      type: workoutCategory === 'cardio' ? 'cardio' : 'strength',
      videoUrl: videoUrl,
      title: plan.title,
      targetRounds: targetRounds,
      duration: plan.duration,
      workoutCategory: workoutCategory,
    });
  };

  if (!plan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>训练计划不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 头部信息 */}
        <View style={styles.header}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.description}>{plan.description}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{plan.duration}</Text>
              <Text style={styles.statLabel}>分钟</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{plan.exercises.length}</Text>
              <Text style={styles.statLabel}>个动作</Text>
            </View>
          </View>
        </View>

        {/* 动作列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>训练动作</Text>
          {plan.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id || index}
              style={[
                styles.exerciseCard,
                selectedExercise?.id === exercise.id && styles.exerciseCardSelected,
              ]}
              onPress={() => setSelectedExercise(exercise)}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {exercise.sets && exercise.reps 
                    ? `${exercise.sets}组 × ${exercise.reps}次` 
                    : `${exercise.duration}秒`}
                </Text>
                {exercise.description && (
                  <Text style={styles.exerciseDescription} numberOfLines={2}>
                    {exercise.description}
                  </Text>
                )}
              </View>
              {exercise.videoUrl && (
                <Text style={styles.videoIndicator}>▶️</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 视频预览 */}
        {selectedExercise?.videoUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>视频演示</Text>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: getVideoUrl(selectedExercise.videoUrl)! }}
                style={styles.video}
                controls={true}
                paused={false}
                resizeMode="contain"
                repeat={true}
                playInBackground={false}
                onLoad={(data) => {
                  console.log('视频加载成功:', data);
                }}
                onError={(e) => {
                  console.log('视频播放错误:', e);
                  Alert.alert('视频加载失败', `错误: ${JSON.stringify(e)}`);
                }}
                onBuffer={(e) => {
                  console.log('视频缓冲中:', e);
                }}
              />
            </View>
            <Text style={styles.videoTitle}>{selectedExercise.name}</Text>
            <Text style={styles.videoDebug}>视频URL: {getVideoUrl(selectedExercise.videoUrl)}</Text>
          </View>
        )}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleFollowWorkout}>
          <Text style={styles.startButtonText}>🎬 开始跟练</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
  header: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  statValue: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
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
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseNumberText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseMeta: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  videoIndicator: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
  },
  video: {
    flex: 1,
  },
  videoTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  followButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  followButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  classicButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  classicButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});

export default WorkoutDetailScreen;
