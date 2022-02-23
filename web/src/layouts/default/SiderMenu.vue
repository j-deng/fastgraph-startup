<template>
  <a-menu
    v-model:openKeys="currentOpenKeys"
    mode="inline"
    :style="{ height: '100%', borderRight: 0 }"
    :selectedKeys="selectedKeys"
  >
    <template v-for="item in menus" :key="item.key">
      <a-menu-item :key="item.key" v-if="!item.children">
        <component :is="item.icon" />
        <span>
          <router-link :to="item.path"> {{ item.name }} </router-link>
        </span>
      </a-menu-item>
      <template v-else>
        <a-sub-menu :key="item.key">
          <template #title>
            <span>
              <component :is="item.icon" />
              <span>{{ item.name }}</span>
            </span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.key">
            <router-link :to="child.path">
              {{ child.name }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </template>
  </a-menu>
</template>

<script lang="ts">
import {
  DesktopOutlined,
  LaptopOutlined,
  NotificationOutlined,
  PieChartOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { defineComponent, PropType, ref, watch } from 'vue'
import { AppMenu } from './menus'

export default defineComponent({
  props: {
    menus: {
      type: Object as PropType<AppMenu[]>,
      default: []
    },
    selectedKeys: {
      type: Array as PropType<string[]>,
      default: []
    },
    openKeys: {
      type: Array as PropType<string[]>,
      default: []
    }
  },

  components: {
    DesktopOutlined,
    LaptopOutlined,
    NotificationOutlined,
    PieChartOutlined,
    UserOutlined
  },

  setup(props) {
    const currentOpenKeys = ref<any>(props.openKeys)

    watch(
      () => props.openKeys,
      (value) => {
        if (value && value.length) {
          currentOpenKeys.value = value
        }
      }
    )

    return { currentOpenKeys }
  }
})
</script>
