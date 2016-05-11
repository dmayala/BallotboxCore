declare module 'redux-persist' {
  export function autoRehydrate();
  export function persistStore(store, settings?: { whitelist?: string[], storage?: any});
}