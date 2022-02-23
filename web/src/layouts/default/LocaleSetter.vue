<template>
  <a-select
    v-model:value="locale"
    style="width: 100px"
    class="head-ghost-select"
  >
    <a-select-option :value="enUS.locale">English</a-select-option>
    <a-select-option :value="zhCN.locale">中文</a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup() {
    const locale = inject('locale') as Ref<string>
    return { locale, enUS, zhCN }
  }
})
</script>

<style>
.head-ghost-select .ant-select-selector {
  color: #fff !important;
  background: transparent !important;
}
.head-ghost-select .ant-select-arrow {
  color: #fff !important;
}
</style>
