import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import fg from 'fastgraph-vue'
import zhCN from 'joi-messages-zh_cn'
import App from './App.vue'
import router from './routes'
import { apolloClient } from './apollo'
import { i18n } from './i18n'
import { store, key } from './store'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})

app.use(Antd)
app.use(router)
app.use(i18n)
app.use(store, key)
app.use(fg, {
  joiMessages: {
    ...zhCN
  }
})
app.mount('#app')
