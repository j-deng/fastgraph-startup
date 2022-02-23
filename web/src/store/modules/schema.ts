import { ResourceEnums, ResourceStore } from 'fastgraph-vue'
import { fetchSchema } from '../../helpers/schema'

export interface SchemaState {
  schema: ResourceStore | undefined
  enums: ResourceEnums | undefined
}

const schemaInStorage = localStorage.getItem('SCHEMA')

export default {
  state: (): SchemaState => {
    return schemaInStorage
      ? {
          schema: JSON.parse(schemaInStorage),
          enums: {}
        }
      : {
          schema: undefined,
          enums: {}
        }
  },

  mutations: {
    setSchema(state: SchemaState, schema: ResourceStore) {
      state.schema = schema
    },
    setEnums(state: SchemaState, enums: ResourceEnums) {
      state.enums = enums
    }
  },

  actions: {
    async fetchSchema({ commit }: any) {
      const { schema, enums } = await fetchSchema()
      commit('setSchema', schema)
      commit('setEnums', enums)
    }
  },

  getters: {}
}
