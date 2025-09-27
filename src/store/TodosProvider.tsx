import React, { createContext, useContext } from 'react';
import { useTodos } from './useTodos';

const Ctx = createContext<ReturnType<typeof useTodos> | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const value = useTodos(); // 全局唯一
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTodosStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTodosStore must be used within <TodosProvider>');
  return ctx;
}

