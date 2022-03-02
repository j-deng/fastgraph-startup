<template>
  <a-tabs v-model:activeKey="activeKey" tabPosition="left">
    <a-tab-pane key="profile" :tab="$t('My profile')">
      <ProfileSetting />
    </a-tab-pane>
    <a-tab-pane key="password" :tab="$t('Password setting')">
      <PasswordSetting />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PasswordSetting from './PasswordSetting.vue'
import ProfileSetting from './ProfileSetting.vue'

export default defineComponent({
  components: {
    ProfileSetting,
    PasswordSetting
  },

  setup() {
    const activeKey = ref('profile')
    return {
      activeKey
    }
  }
})
</script>
