import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  InMemoryCache
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import router from './routes'
import { store } from './store'
import {
  getAccessToken,
  getRefreshToken,
  refreshAuth,
  updateAuthContext
} from './helpers/auth'

let _currentSchemaVersion = localStorage.getItem('schemaVersion')

const makeAuthLink = (accessToken?: string) => {
  const httpLink = createUploadLink({
    uri: (import.meta.env.GRAPHQL_URL as string) || `/graphql`
  })

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization:
          accessToken !== undefined ? accessToken : getAccessToken()
      }
    }
  })

  // refresh auth with refresh token if accesstoken is expired
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors?.length) {
      if (import.meta.env.MODE !== 'production') {
        graphQLErrors.forEach((e) => console.error(e))
      }

      if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          router.push('/user/login')
          return
        }

        // Forward request if refresh token success
        return fromPromise(
          refreshAuth(refreshToken).catch((error: any) => {
            // Handle token refresh errors e.g clear stored tokens, redirect to login
            // @todo use refresh token
            console.error(error)
            updateAuthContext()
            router.push('/user/login')
            return
          })
        )
          .filter((value) => Boolean(value))
          .flatMap((accessToken) => {
            const oldHeaders = operation.getContext().headers
            // modify the operation context with a new token
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `${accessToken}`
              }
            })

            // retry the request, returning the new observable
            return forward(operation)
          })
      }
    }
  })

  // fetch new schema if its version is outdated
  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext()
      const schemaVersion = context.response.headers.get('schemaversion')
      if (schemaVersion !== _currentSchemaVersion) {
        store.dispatch('fetchSchema').then(() => {
          _currentSchemaVersion = schemaVersion
          localStorage.setItem('schemaVersion', schemaVersion)
        })
      }
      return response
    })
  })

  return afterwareLink.concat(errorLink.concat(authLink.concat(httpLink)))
}

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: makeAuthLink(),
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first'
    }
  }
})

// refresh token request has no authorization header
export const makeRefreshAuthClient = () =>
  new ApolloClient({
    link: makeAuthLink(''),
    cache
  })

export const updateApolloLink = () => {
  apolloClient.setLink(makeAuthLink())
}
