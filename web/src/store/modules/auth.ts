import { fetchProfile } from '@/helpers/profile'

export interface UserProfile {
  id: number
  username: string
  nickname: string | undefined
  gender: 'Male' | 'Female' | undefined
  isStaff: boolean
  isActive: boolean
  isSuperuser: boolean
  groups: {
    id: number
    name: string
    permissions: {
      id: number
      codename: string
    }[]
  }[]
  permissions: {
    id: number
    codename: string
  }[]
}

export interface AuthState {
  user: UserProfile | undefined
  accessToken: string | undefined
  refreshToken: string | undefined
}

const authContext = localStorage.getItem('auth')

const state = (): AuthState =>
  authContext
    ? JSON.parse(authContext)
    : {
        user: undefined,
        accessToken: undefined,
        refreshToken: undefined
      }

const getters = {
  nickname(state: AuthState) {
    return state.user?.nickname || state.user?.username
  },
  ownPermissions(state: AuthState) {
    const user = state.user
    if (!user?.permissions) {
      return []
    }
    return [
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

const mutations = {
  setUser(state: AuthState, user: any) {
    state.user = user
  },
  setAccessToken(state: AuthState, accessToken: string | undefined) {
    state.accessToken = accessToken
  },
  setRefreshToken(state: AuthState, refreshToken: string | undefined) {
    state.refreshToken = refreshToken
  }
}

const actions = {
  setAuth({ commit }: any, { accessToken, refreshToken }: AuthState) {
    commit('setAccessToken', accessToken)
    commit('setRefreshToken', refreshToken)
  },
  async fetchProfile({ commit }: any) {
    commit('setUser', await fetchProfile())
  },
  updateProfile({ commit, state }: any, userProfile: any) {
    commit('setUser', { ...state.user, ...userProfile })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
