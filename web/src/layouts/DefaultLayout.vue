<template>
  <a-layout id="app-default-layout" v-if="schema">
    <a-layout-header class="header">
      <a-row justify="space-between" align="middle">
        <a-col>
          <div class="logo">
            <img src="/logo.png" alt="Logo" />
            <span class="title"></span>
          </div>
        </a-col>
        <a-col>
          <UserHeader />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" v-model:collapsed="collapsed" collapsible>
        <SiderMenu
          :menus="menus"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
        />
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0" v-if="selectedKeys[0] !== 'home'">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            {{ item }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div v-else style="height: 24px"></div>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: 'calc(100vh - 54px - 64px - 24px)'
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  <div v-else style="text-align: center; margin: 50px">
    <a-spin />
  </div>
</template>

<script lang="ts">
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons-vue'
import { computed, defineComponent, provide, ref, watch } from 'vue'
import { useStore } from '@/store'
import SiderMenu from './default/SiderMenu.vue'
import UserHeader from './default/UserHeader.vue'
import useMenus from './default/menus'

export default defineComponent({
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    SiderMenu,
    UserHeader
  },

  setup() {
    const store = useStore()
    store.dispatch('fetchSchema')
    store.dispatch('fetchProfile')
    const schema = computed(() => store.state.schema.schema)
    const enums = computed(() => store.state.schema.enums)
    const { menus, selectedKeys, openKeys, breadcrumbs } = useMenus(schema)

    // provide SCHEMA & ENUMS for fg Resource components
    provide('SCHEMA', schema)
    provide('ENUMS', enums)

    if (import.meta.env.MODE !== 'production') {
      watch(schema, () => {
        console.log('schemaVersion ->', localStorage.getItem('schemaVersion'))
      })
    }

    return {
      schema,
      menus,
      selectedKeys,
      openKeys,
      breadcrumbs,
      collapsed: ref<boolean>(false)
    }
  }
})
</script>

<style lang="scss">
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

.logo {
  display: flex;
  align-items: center;

  .title {
    padding: 0 50px 0 12px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.86);
  }
}

.userinfo-btn {
  color: #f0f0f0;
}

.ant-layout-sider-trigger {
  background: #fafafa !important;
  color: black;
}
</style>
