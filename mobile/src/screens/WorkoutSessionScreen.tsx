import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Video from 'react-native-video';
import { colors, fontSize, spacing, borderRadius } from '../constants';

type Props = NativeStackScreenProps<any, 'WorkoutSession'>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  videoUrl?: string;
  sets?: number;
  reps?: number;
}

const { width } = Dimensions.get('window');

const WorkoutSessionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { exercises } = route.params as { planId: string; exercises: Exercise[] };
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<Video>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const completedCount = completedExercises.size;
  const allCompleted = completedCount === exercises.length;

  const handleExerciseComplete = () => {
    if (!currentExercise) return;

    // 标记当前动作完成
    const newCompleted = new Set(completedExercises);
    newCompleted.add(currentExercise.id);
    setCompletedExercises(newCompleted);

    // 如果所有动作都完成了
    if (newCompleted.size === exercises.length) {
      setIsCompleted(true);
    } else if (!isLastExercise) {
      // 自动切换到下一个未完成的动作
      const nextIndex = findNextIncompleteIndex(currentExerciseIndex + 1, newCompleted);
      if (nextIndex !== -1) {
        setCurrentExerciseIndex(nextIndex);
      }
    }
  };

  const findNextIncompleteIndex = (startIndex: number, completed: Set<string>): number => {
    // 从 startIndex 开始找
    for (let i = startIndex; i < exercises.length; i++) {
      if (!completed.has(exercises[i].id)) {
        return i;
      }
    }
    // 从头开始找
    for (let i = 0; i < startIndex; i++) {
      if (!completed.has(exercises[i].id)) {
        return i;
      }
    }
    return -1;
  };

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  const handleFinish = () => {
    Alert.alert(
      '🎉 训练完成！',
      `恭喜你完成了今天的训练！\n共完成 ${completedCount}/${exercises.length} 个动作`,
      [
        {
          text: '返回首页',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: '查看统计',
          onPress: () => navigation.navigate('Stats'),
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}秒`;
    }
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`;
  };

  if (!currentExercise) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>训练数据错误</Text>
      </View>
    );
  }

  if (isCompleted || allCompleted) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>训练完成！</Text>
        <Text style={styles.completedSubtitle}>
          你已完成所有 {exercises.length} 个动作
        </Text>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>完成</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部进度条 */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / exercises.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedCount} / {exercises.length} 完成
        </Text>
      </View>

      {/* 视频播放器 */}
      {currentExercise.videoUrl ? (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: currentExercise.videoUrl }}
            style={styles.video}
            controls={true}
            paused={false}
            resizeMode="cover"
            repeat={true}
          />
        </View>
      ) : (
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>暂无视频</Text>
        </View>
      )}

      {/* 当前动作信息 */}
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        {currentExercise.sets && currentExercise.reps && (
          <Text style={styles.exerciseReps}>
            {currentExercise.sets}组 × {currentExercise.reps}次
          </Text>
        )}
        {currentExercise.duration > 0 && (
          <Text style={styles.exerciseDuration}>
            时长：{formatDuration(currentExercise.duration)}
          </Text>
        )}
        {currentExercise.description && (
          <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
        )}
      </View>

      {/* 完成按钮 */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            completedExercises.has(currentExercise.id) && styles.completeButtonDisabled,
          ]}
          onPress={handleExerciseComplete}
          disabled={completedExercises.has(currentExercise.id)}
        >
          <Text style={styles.completeButtonText}>
            {completedExercises.has(currentExercise.id) ? '✓ 已完成' : '✓ 完成这个动作'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 底部动作列表 */}
      <View style={styles.exerciseListContainer}>
        <Text style={styles.exerciseListTitle}>动作列表</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exerciseList}
        >
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.has(exercise.id);
            const isActive = index === currentExerciseIndex;
            
            return (
              <TouchableOpacity
                key={exercise.id || index}
                style={[
                  styles.exerciseCard,
                  isActive && styles.exerciseCardActive,
                  isCompleted && styles.exerciseCardCompleted,
                ]}
                onPress={() => handleExerciseSelect(index)}
              >
                <View
                  style={[
                    styles.exerciseCardNumber,
                    isCompleted && styles.exerciseCardNumberCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseCardNumberText,
                      isCompleted && styles.exerciseCardNumberTextCompleted,
                    ]}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.exerciseCardName,
                    isActive && styles.exerciseCardNameActive,
                  ]}
                  numberOfLines={2}
                >
                  {exercise.name}
                </Text>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  completedEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  completedTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  completedSubtitle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  finishButton: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  finishButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.card,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  noVideoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
  exerciseInfo: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseName: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  exerciseReps: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  exerciseDuration: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  actionContainer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: colors.success,
    opacity: 0.8,
  },
  completeButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  exerciseListContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exerciseListTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.secondary,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  exerciseList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  exerciseCard: {
    width: width * 0.25,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  exerciseCardActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  exerciseCardCompleted: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}10`,
  },
  exerciseCardNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exerciseCardNumberCompleted: {
    backgroundColor: colors.success,
  },
  exerciseCardNumberText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  exerciseCardNumberTextCompleted: {
    color: colors.text.inverse,
  },
  exerciseCardName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  exerciseCardNameActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  completedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    fontSize: 10,
    color: colors.text.inverse,
    fontWeight: '700',
  },
});

export default WorkoutSessionScreen;
