import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Video, { VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { colors, fontSize, spacing, borderRadius, videoBaseUrl } from '../constants';

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
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<VideoRef>(null);

  const isStrengthTraining = session.type === 'strength';
  const isCardioTraining = session.type === 'cardio';
  const progress = (currentRound / session.targetRounds) * 100;
  const hasVideo = session.workoutCategory === 'upper-body' || session.workoutCategory === 'lower-body';

  // 视频训练页面：解锁横屏，退出时恢复竖屏
  useEffect(() => {
    if (hasVideo) {
      Orientation.unlockAllOrientations();
    }
    return () => {
      Orientation.lockToPortrait();
    };
  }, [hasVideo]);

  // 全屏时按返回键退出全屏
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        exitFullscreen();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isFullscreen]);

  // 判断训练分类
  const isUpperBody = session.workoutCategory === 'upper-body';
  const isLowerBody = session.workoutCategory === 'lower-body';
  const isCardio = session.workoutCategory === 'cardio';

  // 获取视频URL（从 apiConfig 自动推导服务器地址）
  const getVideoUrl = (path: string | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith('/videos/')) {
      return `${videoBaseUrl}${path}`;
    }
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

  const enterFullscreen = () => {
    setIsFullscreen(true);
    Orientation.lockToLandscape();
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    Orientation.lockToPortrait();
  };

  const handleVideoEnd = () => {
    exitFullscreen();
    console.log('视频播放完成，退出全屏并恢复竖屏');
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
            style={isFullscreen ? styles.videoFullscreen : styles.video}
            controls={true}
            paused={false}
            resizeMode={isFullscreen ? 'contain' : 'cover'}
            repeat={false}
            onEnd={handleVideoEnd}
            onError={(e) => {
              console.log('视频播放错误:', e);
              Alert.alert('提示', '视频加载失败，请检查视频文件是否存在');
            }}
            onLoad={() => {
              console.log('视频加载成功，自动进入横屏全屏');
              setTimeout(enterFullscreen, 300);
            }}
            bufferConfig={{
              minBufferMs: 1500,
              maxBufferMs: 5000,
              bufferForPlaybackMs: 1000,
              bufferForPlaybackAfterRebufferMs: 1500,
            }}
          />
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
  videoFullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').height, // 横屏时 window.height 变为宽度
    height: Dimensions.get('window').width,
    backgroundColor: '#000',
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
