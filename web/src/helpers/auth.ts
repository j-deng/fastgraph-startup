import gql from 'graphql-tag'
import { store } from '@/store'
import { makeRefreshAuthClient, updateApolloLink } from '../apollo'

export function updateAuthContext(data?: any) {
  if (!data) {
    store.dispatch('setAuth', {})
    localStorage.removeItem('auth')
  } else {
    store.dispatch('setAuth', data)
    localStorage.setItem('auth', JSON.stringify(data))
  }
  updateApolloLink()
}

export function getAccessToken() {
  const auth = localStorage.getItem('auth')
  return auth ? JSON.parse(auth).accessToken : ''
}

export function getRefreshToken() {
  const auth = localStorage.getItem('auth')
  return auth ? JSON.parse(auth).refreshToken : ''
}

export const LOGIN_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        nickname
      }
      accessToken
      refreshToken
    }
  }
`

export const REFRESH_AUTH_MUTATION = gql`
  mutation ($refreshToken: String!) {
    refreshAuth(refreshToken: $refreshToken) {
      user {
        id
        username
        nickname
      }
      accessToken
      refreshToken
    }
  }
`

let _refreshAuthPromise: undefined | Promise<string>

export const refreshAuth = (refreshToken: string) => {
  // reuse refresh token request because some requests may fail at the same time
  if (!_refreshAuthPromise) {
    _refreshAuthPromise = makeRefreshAuthClient()
      .mutate({
        mutation: REFRESH_AUTH_MUTATION,
        variables: {
          refreshToken
        }
      })
      .then((response) => {
        const { refreshAuth } = response.data
        updateAuthContext(refreshAuth)
        return refreshAuth.accessToken
      })
      .finally(() => {
        _refreshAuthPromise = undefined
      })
  }
  return _refreshAuthPromise
}
