<template>
  <a-form
    name="setPassword"
    style="width: 560px"
    :labelCol="{ span: 8 }"
    @submit="onSubmit"
  >
    <a-form-item
      :label="$t('Old password')"
      name="oldPassword"
      :rules="[{ required: true }]"
    >
      <a-input-password v-model:value="formState.oldPassword" />
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
    <a-form-item :wrapper-col="{ offset: 8 }">
      <a-button type="primary" html-type="submit" :loading="loading">
        {{ $t('Submit') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { message } from 'ant-design-vue'
import { useForm } from 'ant-design-vue/lib/form'
import gql from 'graphql-tag'
import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const SET_SELF_PASSWORD_MUTATION = gql`
  mutation ($password: String!, $oldPassword: String!) {
    setSelfPassword(password: $password, oldPassword: $oldPassword)
  }
`

export default defineComponent({
  setup() {
    const formState = reactive({
      oldPassword: '',
      password: '',
      password2: ''
    })

    const { resetFields } = useForm(formState)

    const {
      mutate: updatePassword,
      loading,
      onDone,
      onError
    } = useMutation(SET_SELF_PASSWORD_MUTATION, () => ({
      variables: {
        oldPassword: formState.oldPassword,
        password: formState.password
      }
    }))

    const { t } = useI18n()

    onDone((res) => {
      resetFields()
      message.success(t('Success'))
    })

    onError((err) => {
      message.error(err.message)
    })

    const onSubmit = () => {
      if (!formState.password || !formState.password2) {
        message.warn(t('Old password is required'))
        return
      }
      if (!formState.password || !formState.password2) {
        message.warn(t('New password is required'))
        return
      }
      if (formState.password !== formState.password2) {
        message.warn(t('Confirm password is required'))
        return
      }
      updatePassword()
    }

    return { formState, loading, onSubmit }
  }
})
</script>
