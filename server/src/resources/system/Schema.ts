import {
  getResourcePermissions,
  checkPermission,
  ResourceStore,
  Resolver,
  Query,
  getRegistry,
  ResourceDecoratorMap,
  resourceRouteNames,
  ResourceRoute,
  UserContext,
  fieldType
} from 'fastgraph-node'

let _enumsValue: string

@Resolver()
class SchemaResolver {
  @Query({ type: 'String' })
  SCHEMA(parent: any, args: any, context: any, info: any) {
    return _buildFrontendSchema(context.store as ResourceStore, context.user)
  }

  @Query({ type: 'String' })
  ENUMS(parent: any, args: any, context: any, info: any) {
    return _enumsValue || (_enumsValue = JSON.stringify(getRegistry().enums))
  }
}

/**
 * Just add type to field decorator and remove decorators key starts with `__`
 *
 * Only show resource with index route and user has permissions
 *
 * @param store
 * @param user
 * @returns
 */
function _buildFrontendSchema(store: ResourceStore, user: UserContext) {
  const result = Object.fromEntries(
    Object.entries(store)
      .filter(([key, resource]) => resourceRouteNames(resource)?.index)
      .filter(([key, resource]) => {
        if (user.isSuperuser) {
          return true
        }
        const permissions = getResourcePermissions(
          resource,
          ResourceRoute.index
        )
        return checkPermission(permissions, user.permissions)
      })
      .map(([key, resource]) => [
        key,
        {
          ...resource,
          fields: resource.fields.map((field) => {
            const decorators: ResourceDecoratorMap = {
              ...field.decorators,
              type: {
                value: fieldType(field, key, false)
              }
            }
            return {
              ...field,
              decorators: Object.fromEntries(
                Object.keys(decorators)
                  .filter((fieldKey) => !fieldKey.startsWith('__'))
                  .map((fieldKey) => [fieldKey, decorators[fieldKey]])
              )
            }
          })
        }
      ])
  )
  return JSON.stringify(result)
}
