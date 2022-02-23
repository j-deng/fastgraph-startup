import axios from 'axios'
import dayjs from 'dayjs'
import {
  Resource,
  Field,
  Type,
  Chart,
  Permission,
  Route,
  LoginRequired
} from 'fastgraph-node'

const chartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  yAxis: [
    {
      type: 'value',
      name: '生猪价格',
      position: 'left',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: '玉米价格',
      position: 'right',
      min: 2000,
      axisLabel: {
        formatter: '{value} 元'
      }
    }
  ],
  series: [
    {
      name: '生猪价格',
      type: 'line',
      smooth: true,
      yAxisIndex: 0
    },
    {
      name: '玉米价格',
      type: 'bar',
      yAxisIndex: 1
    }
  ]
}

@Chart('line', {
  dimensions: ['date', 'pig', 'maize'],
  options: chartOptions
})
@LoginRequired(false)
@Permission('chart_read')
@Resource('生猪价格')
class PigPrice {
  @Type('Date')
  @Field('日期')
  date: Date

  @Field('生猪价格')
  pig: number

  @Field('玉米价格')
  maize: number

  @Route('index')
  async listPigPrice(
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
      data.push({
        date: dayjs()
          .subtract(100 - 1 - i, 'day')
          .format('YYYY-MM-DD'),
        pig: jsonData.pigprice[jsonData.pigprice.length + i - 100],
        maize: jsonData.maizeprice[jsonData.pigprice.length + i - 100]
      })
      i++
    }
    return { data }
  }
}
