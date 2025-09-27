import type { Todo } from '@/src/types/todo';
import { loadJSON, saveJSON } from '@/src/utils/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

const STORAGE_KEY = 'todos.v1';

function genId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export type FilterType = 'all' | 'active' | 'done';

export function useTodos() {
  const [list, setList] = useState<Todo[]>([]);
  const loadedRef = useRef(false);

  const counts = useMemo(() => {
    const done = list.filter(t => t.done).length;
    return { total: list.length, done, active: list.length - done };
  }, [list]);

  const load = useCallback(async () => {
    const data = await loadJSON<Todo[]>(STORAGE_KEY, []);
    setList(Array.isArray(data) ? data.sort((a, b) => b.createdAt - a.createdAt) : []);
    loadedRef.current = true;
  }, []);

  const persist = useCallback((next: Todo[]) => {
    setList(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = useCallback((title: string, description?: string) => {
    const t: Todo = {
      id: genId(),
      title: title.trim(),
      description: description?.trim() || undefined,
      createdAt: Date.now(),
      done: false,
    };
    if (!t.title) {
      Alert.alert('提示', '标题不能为空');
      return;
    }
    const next = [t, ...list];
    persist(next);
  }, [list, persist]);

  const update = useCallback((id: string, patch: Partial<Todo>) => {
    const next = list.map(t => (t.id === id ? { ...t, ...patch } : t));
    persist(next);
  }, [list, persist]);

  const toggle = useCallback((id: string) => {
    const next = list.map(t => (t.id === id ? { ...t, done: !t.done } : t));
    persist(next);
  }, [list, persist]);

  const remove = useCallback((id: string) => {
    const next = list.filter(t => t.id !== id);
    persist(next);
  }, [list, persist]);

  const byId = useCallback((id: string) => list.find(t => t.id === id), [list]);

  const filterList = useCallback((ft: FilterType) => {
    if (ft === 'active') return list.filter(t => !t.done);
    if (ft === 'done') return list.filter(t => t.done);
    return list;
  }, [list]);

  return {
    loaded: loadedRef.current,
    list,
    counts,
    load,
    add,
    update,
    toggle,
    remove,
    byId,
    filterList,
  };
}
