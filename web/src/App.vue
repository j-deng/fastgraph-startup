<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useI18n } from 'vue-i18n'
import { setLocale } from './i18n'

export default defineComponent({
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    provide('locale', locale)
    dayjs.locale(locale.value)

    watch(locale, (val) => {
      dayjs.locale(val)
      setLocale(val)
    })

    return { locale, enUS, zhCN }
  }
})
</script>
