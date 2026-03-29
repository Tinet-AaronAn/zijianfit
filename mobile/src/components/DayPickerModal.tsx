import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
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
  const renderDay = ({ item }: { item: DayOption }) => {
    const isToday = item.dayOfWeek === today;
    return (
      <TouchableOpacity
        style={[styles.dayRow, isToday && styles.dayRowToday]}
        onPress={() => {
          onSelectDay(item);
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.dayRowLeft}>
          <View style={[styles.dayBadge, isToday && styles.dayBadgeToday]}>
            <Text style={[styles.dayBadgeText, isToday && styles.dayBadgeTextToday]}>
              {dayNames[item.dayOfWeek]}
            </Text>
          </View>
          {isToday && <Text style={styles.todayTag}>今天</Text>}
        </View>
        <View style={styles.dayRowCenter}>
          <Text style={[styles.dayRowTitle, item.isRestDay && styles.restText]}>
            {item.title}
          </Text>
          {!item.isRestDay && (
            <Text style={styles.dayRowMeta}>
              💪 {item.exerciseCount}个动作 · ⏱️ {item.duration}分钟
            </Text>
          )}
        </View>
        <View style={styles.dayRowRight}>
          {item.isRestDay ? (
            <Text style={styles.restBadge}>休息</Text>
          ) : (
            <Text style={styles.goArrow}>→</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择训练日</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>选择一天的训练计划开始锻炼</Text>
          <FlatList
            data={days}
            keyExtractor={(item) => item.dayOfWeek.toString()}
            renderItem={renderDay}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
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
    maxHeight: '80%',
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
  },
  list: {
    padding: spacing.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: 72,
    gap: spacing.xs,
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
  todayTag: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
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
  },
  restBadge: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  goArrow: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default DayPickerModal;
