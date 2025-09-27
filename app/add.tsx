import { useTodosStore as useTodos } from '@/src/store/TodosProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

export default function AddScreen() {
  const router = useRouter();
  const { add } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');

  const onSave = () => {
    const t = title.trim();
    if (!t) {
      Alert.alert('提示', '标题不能为空');
      return;
    }
    add(t, description);   // 立刻更新全局列表 + 异步持久化
    router.back();         // 返回列表页时已能看到新任务
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="新增待办页面">
      <TextInput
        style={styles.input}
        placeholder="标题（必填）"
        value={title}
        onChangeText={setTitle}
        maxLength={60}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="描述（可选）"
        value={description}
        onChangeText={setDesc}
        multiline
      />
      <Button title="保存" onPress={onSave} accessibilityLabel="保存待办" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, backgroundColor: '#fff',
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
});
