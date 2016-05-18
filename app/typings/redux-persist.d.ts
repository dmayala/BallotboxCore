declare module 'redux-persist' {
  export function autoRehydrate();
  export function persistStore(store, settings?: { whitelist?: string[], storage?: any}, cb?: Function);
}

declare module 'redux-persist/constants' {
  export const keyPrefix;
  export const REHYDRATE;
  export const REHYDRATE_ERROR;  
}