import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Video from 'react-native-video';
import { colors, fontSize, spacing, borderRadius } from '../constants';
import api from '../services/api';

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
  const { planId } = route.params as { planId: string };
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/plans/${planId}`);
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

  const handleStartWorkout = () => {
    if (!plan) return;
    
    navigation.navigate('WorkoutSession', { 
      planId: plan.id,
      exercises: plan.exercises 
    });
  };

  if (isLoading) {
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
                source={{ uri: selectedExercise.videoUrl }}
                style={styles.video}
                controls={true}
                paused={true}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.videoTitle}>{selectedExercise.name}</Text>
          </View>
        )}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>开始训练</Text>
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
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
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
