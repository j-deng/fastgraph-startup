import {
  Resource,
  Field,
  Present,
  Route,
  getResourcePermissions,
  checkPermission,
  ResourceStore,
  ResourceItem,
  resourceRouteNames,
  ResourceRoute
} from 'fastgraph-node'

@Resource('Resource List')
class ResourceList {
  @Field('Key')
  key: string

  @Field('Name')
  name: string

  @Present('link')
  @Field('Link')
  link: string

  @Route('index')
  async listResourceList(parent: any, args: any, context: any, info: any) {
    const store = context.store as ResourceStore
    const data = Object.entries(store)
      .filter(([key, resource]) => resourceRouteNames(resource)?.index)
      .filter(([key, resource]) => {
        if (context.user.isSuperuser) {
          return true
        }
        const permissions = getResourcePermissions(
          resource,
          ResourceRoute.index
        )
        return checkPermission(permissions, context.user.permissions)
      })
      .map(([key, resource]) => ({
        key,
        name: resourceName(resource),
        link: `/resource/${key}`
      }))
    return { data }
  }
}

function resourceName(resource: ResourceItem): string {
  return resource.decorators.resource?.value || resource.key
}
