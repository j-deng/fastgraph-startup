import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer, AuthenticationError } from 'apollo-server'
import { prisma } from './prisma'
import { hashPassword, verifyToken } from './helpers/auth'
import { userContext } from './helpers/user'
import { makeRegistry, buildSchema } from 'fastgraph-node'

makeRegistry({
  prisma,
  transfroms: [hashPassword]
})

import './resources'
const { typeDefs, resolvers, store, schemaVersion } = buildSchema()
console.log('schemaVersion ->', schemaVersion)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    // response current schema hash
    res.header('schemaversion', schemaVersion)

    // Get the user token from the headers.
    const accessToken = req.headers.authorization || ''
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const context: Record<string, any> = { ip, store }

    if (accessToken) {
      let userId: any
      try {
        const payload = await verifyToken(accessToken)
        userId = payload.userId
      } catch (error: any) {
        throw new AuthenticationError(error.message)
      }
      if (!(await prisma.token.findFirst({ where: { accessToken } }))) {
        throw new AuthenticationError('Invalid token')
      }
      context.user = await userContext(userId)
    }

    return context
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
