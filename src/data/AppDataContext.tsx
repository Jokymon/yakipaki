import Storage from 'expo-sqlite/kv-store';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppData, Category, Language, PackingItem, TravelCollection, TravelPhase } from '../domain/types';
import { seedData } from './seed';

const STORAGE_KEY = 'yakipaki.data.v1';

type DataContextValue = {
  data: AppData;
  ready: boolean;
  setLanguage: (language: Language) => void;
  saveItem: (item: PackingItem) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addPhase: (phase: TravelPhase) => void;
  updatePhase: (phase: TravelPhase) => void;
  deletePhase: (id: string) => void;
  addCollection: (collection: TravelCollection) => void;
  updateCollection: (collection: TravelCollection) => void;
  deleteCollection: (id: string) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Storage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setData(JSON.parse(stored) as AppData);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) Storage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, ready]);

  const update = useCallback((recipe: (current: AppData) => AppData) => setData(recipe), []);
  const value = useMemo<DataContextValue>(() => ({
    data,
    ready,
    setLanguage: (language) => update((current) => ({ ...current, language })),
    saveItem: (item) => update((current) => ({
      ...current,
      items: current.items.some((candidate) => candidate.id === item.id)
        ? current.items.map((candidate) => candidate.id === item.id ? item : candidate)
        : [item, ...current.items]
    })),
    deleteItem: (id) => update((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) })),
    addCategory: (category) => update((current) => ({ ...current, categories: [...current.categories, category] })),
    updateCategory: (category) => update((current) => ({ ...current, categories: current.categories.map((candidate) => candidate.id === category.id ? category : candidate) })),
    deleteCategory: (id) => update((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
      items: current.items.map((item) => ({ ...item, categoryIds: item.categoryIds.filter((categoryId) => categoryId !== id) }))
    })),
    addPhase: (phase) => update((current) => ({ ...current, phases: [...current.phases, phase] })),
    updatePhase: (phase) => update((current) => ({ ...current, phases: current.phases.map((candidate) => candidate.id === phase.id ? phase : candidate) })),
    deletePhase: (id) => update((current) => ({
      ...current,
      phases: current.phases.filter((phase) => phase.id !== id),
      items: current.items.map((item) => ({ ...item, phaseIds: item.phaseIds.filter((phaseId) => phaseId !== id) }))
    })),
    addCollection: (collection) => update((current) => ({ ...current, collections: [...current.collections, collection] })),
    updateCollection: (collection) => update((current) => ({ ...current, collections: current.collections.map((candidate) => candidate.id === collection.id ? collection : candidate) })),
    deleteCollection: (id) => update((current) => ({
      ...current,
      collections: current.collections.filter((collection) => collection.id !== id),
      phases: current.phases.map((phase) => phase.collectionId === id ? { ...phase, collectionId: undefined } : phase)
    }))
  }), [data, ready, update]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData(): DataContextValue {
  const value = useContext(DataContext);
  if (!value) throw new Error('useAppData must be used inside AppDataProvider');
  return value;
}
