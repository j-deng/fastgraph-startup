<template>
  <a-form
    name="setPassword"
    style="width: 560px"
    :labelCol="{ span: 8 }"
    @submit="onSubmit"
  >
    <a-form-item
      :label="$t('Username')"
      name="username"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.username" disabled />
    </a-form-item>
    <a-form-item
      :label="$t('Nickname')"
      name="nickname"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.nickname" />
    </a-form-item>
    <a-form-item
      :label="$t('Gender')"
      name="gender"
      :rules="[{ required: true }]"
    >
      <fg-enum-select enumKey="Gender" v-model:value="formState.gender" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8 }">
      <a-button type="primary" :loading="loading" html-type="submit">
        {{ $t('Submit') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { message } from 'ant-design-vue'
import gql from 'graphql-tag'
import { defineComponent, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const SET_PROFILE_MUTATION = gql`
  mutation ($nickname: String!, $gender: String!) {
    updateSelfProfile(nickname: $nickname, gender: $gender)
  }
`

export default defineComponent({
  setup() {
    const formState = reactive({
      username: '',
      nickname: '',
      gender: undefined
    })

    const store = useStore()
    const setFormSate = () => {
      const user = store.state.auth.user
      formState.username = user?.username
      formState.nickname = user?.nickname
      formState.gender = user?.gender
    }
    setFormSate()
    watch(() => store.state.auth.user, setFormSate)

    const {
      mutate: updateProfile,
      loading,
      onDone,
      onError
    } = useMutation(SET_PROFILE_MUTATION, () => ({
      variables: formState
    }))

    const { t } = useI18n()

    onDone((res) => {
      store.dispatch('updateProfile', { ...formState })
      message.success(t('Success'))
    })

    onError((err) => {
      message.error(err.message)
    })

    const onSubmit = () => {
      updateProfile()
    }

    return { formState, loading, onSubmit }
  }
})
</script>
