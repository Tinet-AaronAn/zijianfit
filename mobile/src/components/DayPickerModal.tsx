import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '../constants';

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface DayOption {
  dayOfWeek: number;
  title: string;
  isRestDay: boolean;
  exerciseCount: number;
  duration: number;
  planId: string;
}

interface DayPickerModalProps {
  visible: boolean;
  onClose: () => void;
  days: DayOption[];
  onSelectDay: (day: DayOption) => void;
  today: number;
}

const DayPickerModal: React.FC<DayPickerModalProps> = ({
  visible,
  onClose,
  days,
  onSelectDay,
  today,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
        >
          {/* 头部 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择训练日</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>选择一天的训练计划开始锻炼</Text>

          {/* 列表 */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {days.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无训练计划</Text>
              </View>
            ) : (
              days.map((item) => {
                const isToday = item.dayOfWeek === today;
                return (
                  <TouchableOpacity
                    key={item.dayOfWeek}
                    style={[styles.dayRow, isToday && styles.dayRowToday]}
                    onPress={() => {
                      onSelectDay(item);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    {/* 左侧：星期 */}
                    <View style={styles.dayRowLeft}>
                      <View style={[styles.dayBadge, isToday && styles.dayBadgeToday]}>
                        <Text style={[styles.dayBadgeText, isToday && styles.dayBadgeTextToday]}>
                          {dayNames[item.dayOfWeek]}
                        </Text>
                      </View>
                    </View>

                    {/* 中间：标题 */}
                    <View style={styles.dayRowCenter}>
                      <Text style={[styles.dayRowTitle, item.isRestDay && styles.restText]}>
                        {item.title}
                      </Text>
                      {!item.isRestDay && item.exerciseCount > 0 && (
                        <Text style={styles.dayRowMeta}>
                          {item.exerciseCount}个动作 · {item.duration}分钟
                        </Text>
                      )}
                    </View>

                    {/* 右侧：标记 */}
                    <View style={styles.dayRowRight}>
                      {isToday && <Text style={styles.todayTag}>今天</Text>}
                      {!item.isRestDay && (
                        <Text style={styles.goArrow}>→</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    height: '70%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: fontSize.xl,
    color: colors.text.secondary,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayRowToday: {
    borderColor: colors.primary,
    borderLeftWidth: 3,
  },
  dayRowLeft: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadge: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dayBadgeToday: {
    backgroundColor: colors.primary,
  },
  dayBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dayBadgeTextToday: {
    color: colors.text.inverse,
  },
  dayRowCenter: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  dayRowTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  restText: {
    color: colors.text.secondary,
  },
  dayRowMeta: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dayRowRight: {
    marginLeft: spacing.sm,
    alignItems: 'center',
  },
  todayTag: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  goArrow: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default DayPickerModal;
