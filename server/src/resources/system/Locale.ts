import { Resolver, Query } from 'fastgraph-node'
import { translations } from '../../locale'

const translationsJson = JSON.stringify(translations)

@Resolver()
class Locale {
  @Query({ type: 'String' })
  resourceTranslations() {
    return translationsJson
  }
}
