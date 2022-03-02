import { ResourceEnums, ResourceStore } from 'fastgraph-vue'
import { fetchSchema } from '@/helpers/schema'

export interface SchemaState {
  schema: ResourceStore | undefined
  enums: ResourceEnums | undefined
}

const schemaInStorage = localStorage.getItem('SCHEMA')

const state = (): SchemaState => {
  return schemaInStorage
    ? {
        schema: JSON.parse(schemaInStorage),
        enums: {}
      }
    : {
        schema: undefined,
        enums: {}
      }
}

const mutations = {
  setSchema(state: SchemaState, schema: ResourceStore) {
    state.schema = schema
  },
  setEnums(state: SchemaState, enums: ResourceEnums) {
    state.enums = enums
  }
}

const actions = {
  async fetchSchema({ commit }: any) {
    const { schema, enums } = await fetchSchema()
    commit('setSchema', schema)
    commit('setEnums', enums)
  }
}

export default {
  state,
  mutations,
  actions
}
