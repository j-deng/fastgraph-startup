import {
  ResourceItem,
  ResourceRoute,
  getResourcePermissions
} from 'fastgraph-vue'
import { useStore } from '@/store'

export default function usePermission() {
  const store = useStore()

  const checkPermission = (permissions: string[]) => {
    if (store.state.auth.user?.isSuperuser) {
      return true
    }
    const ownPermissions = store.getters.ownPermissions
    return (
      permissions.length === 0 ||
      permissions.filter((item) => ownPermissions.includes(item)).length > 0
    )
  }

  const hasResourceIndexPermission = (resource: ResourceItem | undefined) => {
    if (!resource) {
      return false
    }
    return checkPermission(
      getResourcePermissions(resource, ResourceRoute.index)
    )
  }

  return { checkPermission, hasResourceIndexPermission }
}
