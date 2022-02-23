import { UserContext } from 'fastgraph-node'
import { prisma } from '../prisma'

export async function userContext(
  userId: number
): Promise<UserContext | undefined> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      isStaff: true,
      isActive: true,
      isSuperuser: true,
      groups: {
        select: {
          permissions: {
            select: {
              codename: true
            }
          }
        }
      },
      permissions: {
        select: {
          codename: true
        }
      }
    }
  })

  if (!user) {
    return
  }

  return {
    ...user,
    permissions: [
      ...new Set(
        user.permissions
          .map((item) => item.codename)
          .concat(
            ...user.groups.map((group) =>
              group.permissions.map((item) => item.codename)
            )
          )
      )
    ]
  }
}
