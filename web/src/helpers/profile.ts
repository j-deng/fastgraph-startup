import gql from 'graphql-tag'
import { apolloClient } from '@/apollo'
import { UserProfile } from '@/store/modules/auth'

export const USER_PROFILE_QUERY = gql`
  query {
    userProfile {
      id
      username
      nickname
      gender
      isStaff
      isActive
      isSuperuser
      groups {
        id
        name
        permissions {
          id
          codename
        }
      }
      permissions {
        id
        codename
      }
    }
  }
`

export async function fetchProfile(): Promise<UserProfile> {
  const {
    data: { userProfile }
  } = await apolloClient.query({
    query: USER_PROFILE_QUERY,
    fetchPolicy: 'no-cache'
  })
  return userProfile
}
