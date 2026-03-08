import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import { colors, fontSize, spacing, borderRadius } from '../constants';

type Props = NativeStackScreenProps<any, 'FollowWorkout'>;

interface WorkoutSession {
  id: string;
  planId: string;
  dayOfWeek: number;
  type: 'strength' | 'cardio';
  videoUrl?: string;
  title: string;
  targetRounds: number;
  duration: number;
  workoutCategory?: 'upper-body' | 'lower-body' | 'cardio'; // 新增：训练分类
}

const { width, height } = Dimensions.get('window');

const FollowWorkoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const session = route.params as WorkoutSession;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<typeof Video>(null);

  const isStrengthTraining = session.type === 'strength';
  const isCardioTraining = session.type === 'cardio';
  const progress = (currentRound / session.targetRounds) * 100;

  // 判断训练分类
  const isUpperBody = session.workoutCategory === 'upper-body';
  const isLowerBody = session.workoutCategory === 'lower-body';
  const isCardio = session.workoutCategory === 'cardio';

  // 获取视频URL（模拟器用10.0.2.2，真机用实际IP）
  const getVideoUrl = (path: string | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith('/videos/')) {
      const host = '10.0.2.2'; // 模拟器专用
      return `http://${host}:3001${path}`;
    }
    // B站链接或其他URL直接返回
    return path;
  };

  // 判断是否是B站视频
  const isBilibiliVideo = (url: string | undefined): boolean => {
    return url?.includes('bilibili.com') || false;
  };

  // 根据训练分类获取视频URL
  const getWorkoutVideoUrl = (): string | null => {
    if (isUpperBody) {
      return '/videos/upper-body.mp4';
    }
    if (isLowerBody) {
      return '/videos/lower-body.mp4';
    }
    // 其他情况使用传入的 videoUrl
    return session.videoUrl || null;
  };

  const handleCompleteRound = () => {
    const newRound = currentRound + 1;
    setCurrentRound(newRound);

    if (newRound >= session.targetRounds) {
      // 完成所有轮次
      setIsCompleted(true);
      const trainingType = isUpperBody ? '上肢力量' : isLowerBody ? '下肢力量' : '训练';
      Alert.alert(
        '🎉 训练完成！',
        `恭喜你完成了 ${session.targetRounds} 轮${trainingType}训练！\n总时长约 ${Math.round(session.duration * session.targetRounds)} 分钟`,
        [
          {
            text: '返回首页',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      // 还有下一轮
      const trainingType = isUpperBody ? '上肢力量' : isLowerBody ? '下肢力量' : '训练';
      Alert.alert(
        '✅ 完成一轮',
        `已完成 ${newRound}/${session.targetRounds} 轮${trainingType}训练`,
        [
          {
            text: '继续训练',
            style: 'default',
          },
        ]
      );
    }
  };

  const handleVideoEnd = () => {
    // 视频播放完成，提示用户
    setIsPlaying(false);
  };

  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>训练完成！</Text>
        <Text style={styles.completedSubtitle}>
          你已完成所有 {session.targetRounds} 轮训练
        </Text>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.finishButtonText}>返回首页</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部标题和进度 */}
      <View style={styles.header}>
        <Text style={styles.title}>{session.title}</Text>
        
        {/* 轮次进度 */}
        <View style={styles.roundProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.roundText}>
            第 {currentRound + 1} / {session.targetRounds} 轮
          </Text>
        </View>
      </View>

      {/* 训练内容区域 */}
      {(isUpperBody || isLowerBody) ? (
        // 上肢/下肢力量训练：显示视频播放器
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: getVideoUrl(getWorkoutVideoUrl())! }}
            style={styles.video}
            controls={true}
            paused={!isPlaying}
            resizeMode="contain"
            repeat={true}
            onEnd={handleVideoEnd}
            onError={(e) => {
              console.log('视频播放错误:', e);
              Alert.alert('提示', '视频加载失败，请检查视频文件是否存在');
            }}
            onLoad={() => {
              console.log('视频加载成功');
              setIsPlaying(true); // 自动播放
            }}
          />
          {/* 播放提示 */}
          {!isPlaying && (
            <TouchableOpacity
              style={styles.playOverlay}
              onPress={() => setIsPlaying(true)}
            >
              <Text style={styles.playIcon}>▶️</Text>
              <Text style={styles.playText}>点击播放视频</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : isCardio ? (
        // 有氧训练（跑步）：显示跑步提示
        <View style={styles.cardioContainer}>
          <Text style={styles.cardioEmoji}>🏃</Text>
          <Text style={styles.cardioTitle}>开始跑步</Text>
          <Text style={styles.cardioDuration}>
            建议时长：{session.duration} 分钟
          </Text>
          <Text style={styles.cardioHint}>
            跑步过程中可以锁屏或切换App{'\n'}
            跑完后回来点击"完成"
          </Text>
        </View>
      ) : (
        <View style={styles.noContentContainer}>
          <Text style={styles.noContentText}>训练内容加载中...</Text>
        </View>
      )}

      {/* 底部操作区 */}
      <View style={styles.actionContainer}>
        {/* 上肢/下肢力量训练显示轮次提示 */}
        {(isUpperBody || isLowerBody) && (
          <View style={styles.roundInfo}>
            <Text style={styles.roundInfoText}>
              💪 跟着视频完成 {isUpperBody ? '上肢' : '下肢'}训练，视频播完一轮后点击下方按钮
            </Text>
          </View>
        )}

        {/* 完成按钮 */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteRound}
        >
          <Text style={styles.completeButtonText}>
            {isCardio ? '✓ 完成跑步' : '✓ 完成这一轮'}
          </Text>
        </TouchableOpacity>

        {/* 退出按钮 */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            Alert.alert(
              '退出训练',
              '确定要退出吗？当前进度将被清除',
              [
                { text: '取消', style: 'cancel' },
                {
                  text: '确定退出',
                  style: 'destructive',
                  onPress: () => navigation.navigate('Home'),
                },
              ]
            );
          }}
        >
          <Text style={styles.exitButtonText}>退出训练</Text>
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
  
  // Header
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
    marginBottom: spacing.md,
  },
  roundProgress: {
    marginTop: spacing.sm,
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
    backgroundColor: colors.primary,
  },
  roundText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Video
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  playText: {
    fontSize: fontSize.lg,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  webviewHint: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: spacing.sm,
    alignItems: 'center',
  },
  webviewHintText: {
    fontSize: fontSize.sm,
    color: colors.text.inverse,
  },

  // Cardio
  cardioContainer: {
    flex: 1,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardioEmoji: {
    fontSize: 100,
    marginBottom: spacing.lg,
  },
  cardioTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardioDuration: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  cardioHint: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // No content
  noContentContainer: {
    flex: 1,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },

  // Action
  actionContainer: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  roundInfo: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  roundInfoText: {
    fontSize: fontSize.base,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  completeButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  exitButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  exitButtonText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },

  // Completed
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  completedEmoji: {
    fontSize: 100,
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
});

export default FollowWorkoutScreen;
