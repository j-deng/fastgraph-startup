import { prisma } from '../../prisma'
import {
  ApplyLoginRequired,
  ApplyValidation,
  Mutation,
  Resolver
} from 'fastgraph-node'
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  validatePassword,
  generateToken,
  verifyToken
} from '../../helpers/auth'

@Resolver()
class Auth {
  @ApplyValidation('User')
  @ApplyLoginRequired(false)
  @Mutation(`(username: String!, password: String!): Token`)
  async login(parent: any, args: any, context: any, info: any) {
    const { username, password } = args
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !(await validatePassword(user.password, password))) {
      throw new Error('User or password incorrect')
    }
    const token = await prisma.token.create({
      data: await createTokenData(user.id, context.ip)
    })
    return { ...token, user }
  }

  @ApplyLoginRequired(false)
  @Mutation(`(refreshToken: String!): Token`)
  async refreshAuth(
    parent: any,
    args: Record<string, any>,
    context: any,
    info: any
  ) {
    const { refreshToken } = args
    const { userId } = await verifyToken(refreshToken)
    if (!(await prisma.token.findFirst({ where: { refreshToken } }))) {
      throw new Error('Invalid refresh token')
    }
    await prisma.token.deleteMany({ where: { refreshToken } })
    const token = await prisma.token.create({
      data: await createTokenData(userId, context.ip)
    })
    return token
  }
}

async function createTokenData(userId: number, ip: string) {
  const payload = { userId }
  return {
    userId,
    ip,
    accessToken: await generateToken(payload, ACCESS_TOKEN_EXPIRES_IN),
    refreshToken: await generateToken(payload, REFRESH_TOKEN_EXPIRES_IN)
  }
}
