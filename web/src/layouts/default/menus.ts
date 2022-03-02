import { computed, Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { useTranslation } from 'fastgraph-vue'
import usePermission from '@/helpers/permission'

export interface AppMenu {
  key: string
  path?: string
  name: string
  icon?: string
  children?: Array<{
    key: string
    path?: string
    name: string
  }>
}

export default function useMenus(schema: Ref<any>) {
  const route = useRoute()
  const store = useStore()
  const { t, value_t } = useTranslation()
  const { checkPermission, hasResourceIndexPermission } = usePermission()

  const selectedKeys = computed(() => {
    if (route.path == '/index') {
      return ['home']
    }
    return [route.path]
  })

  const openKeys = computed(() => {
    const selected = selectedKeys.value[0]
    const opend = menus.value.find((menu) => {
      return (
        menu.key !== selected &&
        menu.children?.find((child) => child.key === selected)
      )
    })
    return opend ? [opend.key] : []
  })

  const breadcrumbs = computed(() => {
    const selected = selectedKeys.value[0]
    if (selected === 'home') {
      return [t('Home')]
    }
    if (openKeys.value.length === 0) {
      const node = menus.value.find((item) => item.key === selected)
      if (node?.name) {
        return [t('Home'), node.name]
      }
      if (selected === '/user/profile') {
        return [t('Home'), t('Profile')]
      }
      if (selected.startsWith('/resource')) {
        return [t('Home'), t('Resources'), value_t(selected.split('/')[2])]
      }
      return [t('Home'), '~']
    } else {
      const node = menus.value.find((item) => item.key === openKeys.value[0])
      return [
        t('Home'),
        node?.name,
        node?.children?.find((item) => item.key === selected)?.name
      ]
    }
  })

  const getGroupResourceMenus = (options: {
    key: string
    name: string
    icon: string
    children: { resource: string; name?: string }[]
  }) => {
    const children = options.children
      .filter(({ resource }) =>
        hasResourceIndexPermission(schema.value[resource])
      )
      .map(({ resource, name }) => ({
        name: name || resource,
        key: `/resource/${resource}`,
        path: `/resource/${resource}`
      }))
    if (children.length) {
      return [{ ...options, children }]
    }
    return []
  }

  const menus: Ref<AppMenu[]> = computed(() => {
    return [
      {
        key: 'home',
        path: '/',
        icon: 'desktop-outlined',
        name: t('Home')
      },
      ...(checkPermission(['auth_read'])
        ? getGroupResourceMenus({
            key: 'sys',
            name: t('System Control'),
            icon: 'user-outlined',
            children: [
              {
                name: t('User Control'),
                resource: 'User'
              },
              {
                name: t('User Group'),
                resource: 'Group'
              },
              {
                name: t('Permission List'),
                resource: 'Permission'
              }
            ]
          })
        : []),
      ...(store.state.auth.user?.isSuperuser
        ? [
            {
              key: '/resource/ResourceList',
              name: 'Resources',
              icon: 'pie-chart-outlined',
              path: '/resource/ResourceList'
            }
          ]
        : [])
    ]
  })

  return { menus, selectedKeys, openKeys, breadcrumbs }
}
