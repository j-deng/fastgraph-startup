import { createStore } from 'vuex'
import auth from './modules/auth'
import schema from './modules/schema'

const store = createStore({
  modules: {
    auth,
    schema
  }
})

export default store
