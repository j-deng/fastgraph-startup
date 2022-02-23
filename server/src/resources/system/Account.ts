import { prisma } from '../../prisma'
import {
  ApplyPermission,
  ApplyValidation,
  Field,
  Mutation,
  Resolver,
  Resource,
  Validation
} from 'fastgraph-node'
import { hashPassword, validatePassword } from '../../helpers/auth'

@Resource()
class UserPasswordSettingResource {
  @Validation({ min: 6, max: 50 })
  @Field()
  password: string

  @Validation({ min: 6 })
  @Field()
  oldPassword: string
}

@Resolver()
class Account {
  @ApplyValidation('User')
  @ApplyPermission('auth_control')
  @Mutation({
    type: 'Boolean',
    args: { id: 'ID!', password: 'String!' }
  })
  async setUserPassword(parent: any, args: any, context: any, info: any) {
    const { id, password } = args
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: await hashPassword(password) }
    })
    return true
  }

  @ApplyValidation('UserPasswordSettingResource')
  @Mutation({
    type: 'Boolean',
    args: { password: 'String!', oldPassword: 'String!' }
  })
  async setSelfPassword(parent: any, args: any, context: any, info: any) {
    const userId = context.user.id
    const { password, oldPassword } = args
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !(await validatePassword(user.password, oldPassword))) {
      throw new Error('User or password incorrect')
    }
    await prisma.user.update({
      where: { id: context.user.id },
      data: { password: await hashPassword(password) }
    })
    return true
  }
}
