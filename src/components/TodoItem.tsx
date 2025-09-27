import { colors } from '@/src/theme/colors';
import type { Todo } from '@/src/types/todo';
import { Link } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;               // 现在为必填
  highlight?: (text: string) => React.ReactNode; // 搜索高亮
};

export function TodoItem({ item, onToggle, onDelete, highlight }: Props) {
  const confirmDelete = () => {
    Alert.alert('确认删除', `确定要删除「${item.title}」吗？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  };

  return (
    <View style={styles.wrap} accessible accessibilityLabel={`待办 ${item.title}`}>
      {/* 勾选切换 */}
      <Pressable onPress={() => onToggle(item.id)} style={styles.checkbox} accessibilityLabel="切换完成状态">
        <Text style={[styles.checkText, item.done && styles.checked]}>{item.done ? '✓' : ''}</Text>
      </Pressable>

      {/* 标题/描述，点进详情 */}
      <Link href={{ pathname: '/todo/[id]', params: { id: item.id } }} asChild>
        <Pressable style={styles.content} accessibilityLabel="进入详情">
          <Text style={[styles.title, item.done && styles.doneText]} numberOfLines={1}>
            {highlight ? highlight(item.title) : item.title}
          </Text>
          {!!item.description && (
            <Text style={styles.desc} numberOfLines={1}>
              {highlight ? highlight(item.description) : item.description}
            </Text>
          )}
        </Pressable>
      </Link>

      {/* 右侧删除按钮（明显、可点） */}
      <Pressable onPress={confirmDelete} style={styles.delBtn} accessibilityLabel="删除待办">
        <Text style={styles.delText}>删</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#999',
    alignItems: 'center', justifyContent: 'center'
  },
  checkText: { fontSize: 16, color: colors.primary },
  checked: { color: colors.primary },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  doneText: { textDecorationLine: 'line-through', color: '#777' },
  desc: { color: '#666', marginTop: 2 },
  delBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
    backgroundColor: '#ffebee', borderWidth: 1, borderColor: '#ffcdd2',
  },
  delText: { color: '#c62828', fontWeight: '700' },
});


