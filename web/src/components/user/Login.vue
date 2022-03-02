<template>
  <a-row type="flex" justify="center" align="middle">
    <a-col>
      <a-card style="width: 400px; margin-top: 120px; text-align: center">
        <img src="/fastgraph-small.png" alt="" />
        <a-form
          :model="formState"
          @finish="handleFinish"
          @finishFailed="handleFinishFailed"
        >
          <br />
          <a-form-item>
            <a-input
              v-model:value="formState.username"
              :placeholder="$t('Username')"
              size="large"
            >
              <template #prefix>
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model:value="formState.password"
              type="password"
              :placeholder="$t('Password')"
              size="large"
            >
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
              :disabled="formState.username === '' || formState.password === ''"
            >
              {{ $t('Login') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive } from 'vue'
import type { UnwrapRef } from 'vue'
import { FormProps, message } from 'ant-design-vue'
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { useTranslation } from 'fastgraph-vue'
import { LOGIN_MUTATION, updateAuthContext } from '@/helpers/auth'

interface FormState {
  username: string
  password: string
}

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },

  setup() {
    const router = useRouter()
    const store = useStore()
    const { t } = useTranslation()
    const formState: UnwrapRef<FormState> = reactive({
      username: '',
      password: ''
    })

    const {
      mutate: login,
      loading,
      onDone,
      onError
    } = useMutation(LOGIN_MUTATION, () => ({
      variables: formState
    }))

    onDone((res) => {
      message.success(t('Welcome back!'))
      updateAuthContext(res.data.login)
      store.dispatch('fetchProfile')
      router.push('/')
    })

    onError((err) => {
      message.error(err.message)
    })

    const handleFinish: FormProps['onFinish'] = (values) => {
      login()
    }

    const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
      console.log(errors)
    }

    return {
      loading,
      formState,
      handleFinish,
      handleFinishFailed
    }
  }
})
</script>
