import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import auth, { AuthState } from './modules/auth'
import schema, { SchemaState } from './modules/schema'

export interface State {
  auth: AuthState
  schema: SchemaState
}

// https://vuex.vuejs.org/guide/typescript-support.html
export const key: InjectionKey<Store<State>> =
  (window as any).$vuexStoreKey || ((window as any).$vuexStoreKey = Symbol())

export function useStore() {
  return baseUseStore(key)
}

export const store = createStore({
  strict: import.meta.env.MODE !== 'production',
  modules: {
    auth,
    schema
  }
})
