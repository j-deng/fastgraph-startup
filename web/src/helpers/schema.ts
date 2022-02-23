import gql from 'graphql-tag'
import { apolloClient } from '../apollo'
import { addLocaleMessages } from '../i18n'

export const SCHEMA_QUERY = gql`
  query {
    SCHEMA
    ENUMS
    resourceTranslations
  }
`

let _fetchSchemaPromise: undefined | Promise<{ schema: any; enums: any }>

export function fetchSchema(): Promise<any> {
  if (!_fetchSchemaPromise) {
    _fetchSchemaPromise = apolloClient
      .query({ query: SCHEMA_QUERY, fetchPolicy: 'no-cache' })
      .then(({ data }) => {
        const schema = JSON.parse(data.SCHEMA)
        const enums = JSON.parse(data.ENUMS)
        localStorage.setItem('SCHEMA', data.SCHEMA)
        addLocaleMessages(JSON.parse(data.resourceTranslations))
        return { schema, enums }
      })
      .finally(() => {
        _fetchSchemaPromise = undefined
      })
  }
  return _fetchSchemaPromise
}
