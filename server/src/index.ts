import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import {
  makeRegistry,
  buildSchema,
  graphqlUploadExpress,
  MinioStore
} from 'fastgraph-node'
import { prisma } from './prisma'
import { hashPassword, verifyToken } from './helpers/auth'
import { userContext } from './helpers/user'

makeRegistry({
  prisma,
  fileStore: new MinioStore(),
  transfroms: [hashPassword]
})

import './resources'
const { typeDefs, resolvers, store, schemaVersion } = buildSchema()
console.log('schemaVersion ->', schemaVersion)

async function startServer() {
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

  await server.start()

  const app = express()

  app.use(graphqlUploadExpress())

  server.applyMiddleware({ app })

  await new Promise<void>((r) => app.listen({ port: 4000 }, r))

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startServer()
