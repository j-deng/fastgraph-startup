import { Store } from 'vuex'
import type { State } from './'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
