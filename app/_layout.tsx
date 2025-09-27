import { TodosProvider } from '@/src/store/TodosProvider';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TodosProvider>
        <Stack screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="index" options={{ title: '待办清单' }} />
          <Stack.Screen name="add" options={{ title: '新增待办' }} />
          <Stack.Screen name="todo/[id]" options={{ title: '详情/编辑' }} />
        </Stack>
      </TodosProvider>
    </GestureHandlerRootView>
  );
}



