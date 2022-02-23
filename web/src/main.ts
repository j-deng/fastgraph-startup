import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import fg from 'fastgraph-vue'
import App from './App.vue'
import router from './routes'
import { apolloClient } from './apollo'
import { i18n } from './i18n'
import store from './store'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})

app.use(Antd)
app.use(router)
app.use(i18n)
app.use(store)
app.use(fg)
app.mount('#app')
