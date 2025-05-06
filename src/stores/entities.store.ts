import { StateCreator, create } from 'zustand';
import type { Account } from '../services/account/accountTypes';

export interface EntityCache<T> {
  items: Record<string, T>;
  ids: string[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}

interface EntitiesState {
  // Entity Caches
  accounts: EntityCache<Account>;
  leads: EntityCache<any>;
  opportunities: EntityCache<any>;
  
  // Cache Management
  clearCache: (entityType: keyof Omit<EntitiesState, 'clearCache' | 'invalidateCache' | 'updateCache'>) => void;
  invalidateCache: (entityType: keyof Omit<EntitiesState, 'clearCache' | 'invalidateCache' | 'updateCache'>) => void;
  updateCache: <T>(
    entityType: keyof Omit<EntitiesState, 'clearCache' | 'invalidateCache' | 'updateCache'>,
    items: T[],
    idKey?: keyof T
  ) => void;
}

const createEmptyCache = (): EntityCache<any> => ({
  items: {},
  ids: [],
  timestamp: 0,
  loading: false,
  error: null,
});

const initialState: Omit<EntitiesState, 'clearCache' | 'invalidateCache' | 'updateCache'> = {
  accounts: createEmptyCache(),
  leads: createEmptyCache(),
  opportunities: createEmptyCache(),
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const createEntitiesSlice: StateCreator<EntitiesState> = (set, get) => ({
  ...initialState,

  clearCache: (entityType) => {
    set({
      [entityType]: createEmptyCache()
    } as Partial<EntitiesState>);
  },

  invalidateCache: (entityType) => {
    const cache = get()[entityType];
    set({
      [entityType]: {
        ...cache,
        timestamp: 0
      }
    } as Partial<EntitiesState>);
  },

  updateCache: (entityType, items, idKey = 'id' as keyof any) => {
    const timestamp = Date.now();
    const itemsRecord = items.reduce((acc, item) => {
      acc[item[idKey]] = item;
      return acc;
    }, {} as Record<string, any>);

    set({
      [entityType]: {
        items: itemsRecord,
        ids: items.map(item => item[idKey]),
        timestamp,
        loading: false,
        error: null
      }
    } as Partial<EntitiesState>);
  }
});

// Helper functions for working with cache
export const isCacheValid = (cache: EntityCache<any>) => {
  return cache.timestamp > 0 && Date.now() - cache.timestamp < CACHE_TTL;
};

export const getCachedItems = <T>(cache: EntityCache<T>): T[] => {
  return cache.ids.map(id => cache.items[id]);
};

export const getCachedItem = <T>(cache: EntityCache<T>, id: string): T | undefined => {
  return cache.items[id];
};

// Create the store
export const useEntitiesStore = create<EntitiesState>()(createEntitiesSlice);