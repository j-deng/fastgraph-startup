<template>
  <a-space size="large">
    <a-button
      type="link"
      class="userinfo-btn"
      @click="$router.push('/user/profile')"
    >
      <template #icon>
        <a-avatar style="color: #f56a00; background-color: #fde3cf">
          {{ avatrChar }}
        </a-avatar>
      </template>
      <span> &nbsp; {{ $t('Welcome, {name}', { name: nickname }) }} </span>
    </a-button>
    <LocaleSetter />
    <a-button type="default" @click="showLogoutConfirm" ghost>
      <template #icon><LogoutOutlined /></template>
      {{ $t('Logout') }}
    </a-button>
  </a-space>
</template>

<script lang="ts">
import {
  LogoutOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { computed, createVNode, defineComponent } from 'vue'
import { useTranslation } from 'fastgraph-vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import LocaleSetter from './LocaleSetter.vue'

export default defineComponent({
  components: {
    UserOutlined,
    LogoutOutlined,
    LocaleSetter
  },

  setup() {
    const router = useRouter()
    const store = useStore()
    const { t } = useTranslation()

    const logout = () => {
      localStorage.removeItem('auth')
      message.success(t('You are logged out.'))
      router.push('/user/login')
    }

    const showLogoutConfirm = () => {
      Modal.confirm({
        title: t('Please confirm to log out?'),
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          return new Promise((resolve, reject) => {
            logout()
            resolve(0)
          })
        }
      })
    }

    const nickname = computed(() => store.getters.nickname)
    const avatrChar = computed(
      () => nickname.value?.substr(0, 1).toUpperCase() || ''
    )

    return {
      nickname,
      avatrChar,
      showLogoutConfirm
    }
  }
})
</script>
