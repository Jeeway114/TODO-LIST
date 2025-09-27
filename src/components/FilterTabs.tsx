import type { FilterType } from '@/src/store/useTodos';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  value: FilterType;
  counts: { total: number; active: number; done: number };
  onChange: (v: FilterType) => void;
};

export function FilterTabs({ value, counts, onChange }: Props) {
  const tabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: counts.total },
    { key: 'active', label: '未完成', count: counts.active },
    { key: 'done', label: '已完成', count: counts.done },
  ];

  return (
    <View style={styles.row}>
      {tabs.map(t => (
        <Pressable
          key={t.key}
          onPress={() => onChange(t.key)}
          style={[styles.tab, value === t.key && styles.active]}
          accessibilityLabel={`筛选 ${t.label}`}
        >
          <Text style={[styles.tabText, value === t.key && styles.activeText]}>
            {t.label} <Text style={styles.badge}>{t.count}</Text>
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#eee' },
  active: { backgroundColor: '#2e7d32' },
  tabText: { fontSize: 14 },
  activeText: { color: '#fff' },
  badge: { fontWeight: '700' },
});
