import { Link } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterTabs } from '@/src/components/FilterTabs';
import { Highlighter } from '@/src/components/Highlighter';
import { TodoItem } from '@/src/components/TodoItem';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { useTodosStore as useTodos } from '@/src/store/TodosProvider';
import type { FilterType } from '@/src/store/useTodos';
import { colors } from '@/src/theme/colors';

export default function TodoListScreen() {
  const { counts, toggle, remove, filterList } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [q, setQ] = useState('');
  const qDebounced = useDebouncedValue(q, 300);

  const data = useMemo(() => {
    const base = filterList(filter);
    if (!qDebounced.trim()) return base;
    const kw = qDebounced.toLowerCase();
    return base.filter(t =>
      t.title.toLowerCase().includes(kw) || (t.description ?? '').toLowerCase().includes(kw)
    );
  }, [filter, filterList, qDebounced]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <TodoItem
        item={item}
        onToggle={toggle}
        onDelete={remove}  
        highlight={(text) => <Highlighter text={text} keyword={qDebounced} />}
      />
    ),
    [toggle, remove, qDebounced]
  );

  return (
    <View style={styles.container} accessible accessibilityLabel="待办列表页面">
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="搜索标题或描述"
          value={q}
          onChangeText={setQ}
          accessibilityLabel="搜索输入框"
          returnKeyType="search"
        />
        <Link href="/add" asChild>
          <Pressable style={styles.addBtn} accessibilityLabel="新增待办">
            <Text style={styles.addBtnText}>＋</Text>
          </Pressable>
        </Link>
      </View>

      <FilterTabs value={filter} counts={counts} onChange={setFilter} />

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{qDebounced ? '无搜索结果' : '暂无待办，点击右侧 ＋ 新增'}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          windowSize={5}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  search: {
    flex: 1,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8,
    backgroundColor: colors.bg,
  },
  addBtn: {
    width: 44, height: 44, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: colors.primaryTextOn, fontWeight: '700', fontSize: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#777' },
});
