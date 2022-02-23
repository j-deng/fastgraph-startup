<template>
  <fg-resource
    resourceKey="User"
    :extRecordOperations="[{ name: $t('Password'), callback: onSetPassword }]"
  />
  <a-modal
    v-model:visible="showSetPasswordModal"
    :title="$t('Password setting')"
    :confirm-loading="confirmLoading"
    @ok="setPassword"
  >
    <a-form name="setPassword">
      <a-form-item
        :label="$t('User account')"
        name="username"
        :rules="[{ required: true }]"
      >
        <a-input v-model:value="username" disabled />
      </a-form-item>
      <a-form-item
        :label="$t('Login password')"
        name="password"
        :rules="[{ required: true }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item
        :label="$t('Confirm password')"
        name="password2"
        :rules="[{ required: true }]"
      >
        <a-input-password v-model:value="formState.password2" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { message } from 'ant-design-vue'
import gql from 'graphql-tag'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const SET_USER_PASSWORD = gql`
  mutation ($id: ID!, $password: String!) {
    setUserPassword(id: $id, password: $password)
  }
`

export default defineComponent({
  setup() {
    const showSetPasswordModal = ref(false)
    const username = ref<string>('')
    const userId = ref<number>(0)
    const formState = reactive({
      password: '',
      password2: ''
    })

    const onSetPassword = (record: any) => {
      showSetPasswordModal.value = true
      userId.value = record.id
      username.value = record.username
    }

    const {
      mutate: setUserPassword,
      loading: confirmLoading,
      onDone,
      onError
    } = useMutation(SET_USER_PASSWORD, () => ({
      variables: {
        id: userId.value,
        password: formState.password
      }
    }))

    const { t } = useI18n()

    onDone((res) => {
      message.success(t('Success'))
      setTimeout(() => {
        showSetPasswordModal.value = false
      }, 800)
    })

    onError((err) => {
      message.error(err.message)
    })

    const setPassword = () => {
      if (!formState.password || !formState.password2) {
        message.warn(t('New password is required'))
        return
      }
      if (formState.password !== formState.password2) {
        message.warn(t('Confirm password is required'))
        return
      }
      setUserPassword()
    }

    watch(showSetPasswordModal, () => {
      formState.password = ''
      formState.password2 = ''
    })

    return {
      onSetPassword,
      showSetPasswordModal,
      setPassword,
      formState,
      username,
      confirmLoading
    }
  }
})
</script>
