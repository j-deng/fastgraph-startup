import axios from 'axios'
import dayjs from 'dayjs'
import { Resource, Field, Type, Chart, Matrix, Route } from 'fastgraph-node'

@Chart('line')
@Matrix({ row: 'date', col: 'type', val: 'price' })
@Resource('生猪价格')
class PigPriceFlat {
  @Type('Date')
  @Field('日期')
  date: Date

  @Field('类型')
  type: string

  @Field('价格')
  price: number

  @Route('index')
  async listPigPriceFlat(
    parent: any,
    args: Record<string, any>,
    context: any,
    info: any
  ) {
    const res = await axios.get(
      'https://zhujia.zhuwang.cc/api/chartData?areaId=-1'
    )
    const jsonData = res.data
    const data: any = []
    let i = 0
    while (i < 100) {
      const date = dayjs()
        .subtract(100 - 1 - i, 'day')
        .format('YYYY-MM-DD')
      data.push({
        date,
        type: '生猪价格（元/吨）',
        price: jsonData.pigprice[jsonData.pigprice.length + i - 100] * 1000
      })
      data.push({
        date,
        type: '玉米价格（元/吨）',
        price: jsonData.maizeprice[jsonData.maizeprice.length + i - 100]
      })
      i++
    }
    return { data }
  }
}
