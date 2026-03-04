import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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

const WorkoutSessionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { exercises } = route.params as { planId: string; exercises: Exercise[] };
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<Video>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  useEffect(() => {
    if (currentExercise) {
      setTimeLeft(currentExercise.duration);
    }
  }, [currentExerciseIndex]);

  useEffect(() => {
    if (!isPaused && !isCompleted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      handleExerciseComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isPaused, isCompleted]);

  const handleExerciseComplete = () => {
    setCompletedExercises(new Set([...completedExercises, currentExerciseIndex]));

    if (isLastExercise) {
      setIsCompleted(true);
    } else {
      Alert.alert(
        '动作完成！',
        '休息10秒后开始下一个动作',
        [
          {
            text: '立即开始',
            onPress: () => {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            },
          },
          {
            text: '休息10秒',
            onPress: () => {
              setIsPaused(true);
              setTimeout(() => {
                setIsPaused(false);
                setCurrentExerciseIndex(currentExerciseIndex + 1);
              }, 10000);
            },
          },
        ]
      );
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    Alert.alert(
      '跳过当前动作',
      '确定要跳过这个动作吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            if (isLastExercise) {
              setIsCompleted(true);
            } else {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            }
          },
        },
      ]
    );
  };

  const handleFinish = () => {
    Alert.alert(
      '🎉 训练完成！',
      `恭喜你完成了今天的训练！\n共完成 ${completedExercises.size}/${exercises.length} 个动作`,
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentExercise) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>训练数据错误</Text>
      </View>
    );
  }

  if (isCompleted) {
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
      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentExerciseIndex + 1} / {exercises.length}
        </Text>
      </View>

      {/* 视频演示 */}
      {currentExercise.videoUrl && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: currentExercise.videoUrl }}
            style={styles.video}
            controls={true}
            paused={isPaused}
            resizeMode="cover"
            repeat={true}
          />
        </View>
      )}

      {/* 动作信息 */}
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        {currentExercise.sets && currentExercise.reps && (
          <Text style={styles.exerciseReps}>
            {currentExercise.sets}组 × {currentExercise.reps}次
          </Text>
        )}
        {currentExercise.description && (
          <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
        )}
      </View>

      {/* 倒计时 */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>剩余时间</Text>
        <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
      </View>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
          <Text style={styles.controlButtonIcon}>{isPaused ? '▶️' : '⏸️'}</Text>
          <Text style={styles.controlButtonText}>{isPaused ? '继续' : '暂停'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.controlButtonSecondary]}
          onPress={handleSkip}
        >
          <Text style={styles.controlButtonIcon}>⏭️</Text>
          <Text style={styles.controlButtonText}>跳过</Text>
        </TouchableOpacity>
      </View>

      {/* 动作列表 */}
      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <View
            key={exercise.id || index}
            style={[
              styles.exerciseListItem,
              index === currentExerciseIndex && styles.exerciseListItemActive,
              completedExercises.has(index) && styles.exerciseListItemCompleted,
            ]}
          >
            <Text
              style={[
                styles.exerciseListItemText,
                completedExercises.has(index) && styles.exerciseListItemTextCompleted,
              ]}
            >
              {completedExercises.has(index) ? '✓' : index + 1}
            </Text>
            <Text style={styles.exerciseListItemName}>{exercise.name}</Text>
          </View>
        ))}
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    marginLeft: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
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
    marginBottom: spacing.sm,
  },
  exerciseDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timerLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  timerValue: {
    fontSize: fontSize['4xl'] * 2,
    fontWeight: '700',
    color: colors.primary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  controlButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  controlButtonSecondary: {
    opacity: 0.6,
  },
  controlButtonIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  controlButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  exerciseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.sm,
  },
  exerciseListItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseListItemActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  exerciseListItemCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  exerciseListItemText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  exerciseListItemTextCompleted: {
    color: colors.text.inverse,
  },
  exerciseListItemName: {
    display: 'none',
  },
});

export default WorkoutSessionScreen;
