import { prisma } from '../../prisma'
import { ApplyValidation, Mutation, Query, Resolver } from 'fastgraph-node'

@Resolver()
class UserProfileResolver {
  @Query({ type: 'User' })
  async userProfile(parent: any, args: any, context: any, info: any) {
    const user = await prisma.user.findUnique({
      where: { id: context.user.id }
    })
    return user
  }

  @ApplyValidation('User')
  @Mutation({
    type: 'Boolean',
    args: {
      nickname: 'String!',
      gender: 'String!'
    }
  })
  async updateSelfProfile(parent: any, args: any, context: any, info: any) {
    await prisma.user.update({
      where: { id: context.user.id },
      data: args
    })
    return true
  }
}
