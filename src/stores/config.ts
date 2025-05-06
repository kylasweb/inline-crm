import { StateCreator, create } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

// Middleware Types
export type StoreWithPersist<T> = (
  config: StateCreator<T>,
  options: PersistOptions<T>
) => StateCreator<T>

// Generic Store Creation Types
export type CreateStoreWithPersist<T> = (
  stateCreator: StateCreator<T>,
  persistOptions: PersistOptions<T>
) => ReturnType<typeof create<T>>

// Create Store with Persist Middleware
export const createPersistStore = <T extends object>(
  initializer: StateCreator<T>,
  name: string,
  version = 1
) => {
  const persistConfig: PersistOptions<T> = {
    name,
    storage: createJSONStorage<T>(() => localStorage),
    version,
    migrate: (persistedState: unknown, version: number) => {
      // Add migration logic here if needed
      return persistedState as T
    }
  }

  return create<T>()(
    persist(initializer, persistConfig)
  )
}

// Middleware Composer
export const composeMiddleware = <T extends object>(
  ...middlewares: Array<(stateCreator: StateCreator<T>) => StateCreator<T>>
) => {
  return (createState: StateCreator<T>) =>
    middlewares.reduceRight((acc, middleware) => middleware(acc), createState)
}

// Helper to create store slice
export const createStoreSlice = <T extends object, K extends keyof T>(
  set: (fn: (state: T) => Partial<T>) => void,
  get: () => T,
  initialState: Pick<T, K>
) => ({
  ...initialState,
  setState: (slice: Partial<Pick<T, K>>) =>
    set((state) => ({ ...state, ...slice }))
})