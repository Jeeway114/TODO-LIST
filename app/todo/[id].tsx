
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTodosStore as useTodos } from '@/src/store/TodosProvider';

export default function TodoDetailScreen() { 
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { byId, update, toggle, remove } = useTodos();

  const todo = byId(id!);

  const [title, setTitle] = useState(todo?.title ?? '');
  const [desc, setDesc] = useState(todo?.description ?? '');

  const createdAt = useMemo(() => {
    if (!todo) return '';
    const d = new Date(todo.createdAt);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const time = d.toTimeString().slice(0, 8);
    return `${d.getFullYear()}-${mm}-${dd} ${time}`;
  }, [todo]);

  if (!todo) {
    return (
      <View style={styles.container}>
        <Text>未找到该待办</Text>
        <Button title="返回" onPress={() => router.back()} />
      </View>
    );
  }

  const onSave = () => {
    const t = title.trim();
    if (!t) {
      Alert.alert('提示', '标题不能为空');
      return;
    }
    update(todo.id, { title: t, description: desc.trim() || undefined });
    router.back(); 
  };

  const onDelete = () => {
    Alert.alert('确认删除', '删除后不可恢复', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          remove(todo.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="待办详情页面">
      <View style={styles.row}>
        <Text style={styles.label}>完成</Text>
        <Switch value={todo.done} onValueChange={() => toggle(todo.id)} />
      </View>

      <Text style={styles.meta}>创建时间：{createdAt}</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="标题（必填）"
        maxLength={60}
        accessibilityLabel="编辑标题"
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        value={desc}
        onChangeText={setDesc}
        placeholder="描述（可选）"
        multiline
        accessibilityLabel="编辑描述"
      />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="保存" onPress={onSave} accessibilityLabel="保存编辑" />
        <Button title="删除" onPress={onDelete} color="#c62828" accessibilityLabel="删除待办" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 16, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16 },
  meta: { color: '#666' },
  input: {
    borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, backgroundColor: '#fff',
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
});
