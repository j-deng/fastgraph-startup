import dayjs from 'dayjs'
import { prisma } from '../prisma'
import {
  Resource,
  Field,
  Type,
  Filter,
  Chart,
  Permission,
  Omit,
  Route,
  StaffRequired
} from 'fastgraph-node'

@Chart('bar', { dimensions: ['dateRegister', 'count'] })
@StaffRequired()
@Permission('chart_read')
@Resource('用户注册数')
class UserRegisterCount {
  @Type('Date')
  @Field('日期')
  dateRegister: Date

  @Field('数量')
  count: number

  @Type('Int')
  @Field('Timestamp')
  timestamp(parent: any, args: any, context: any, info: any) {
    return dayjs(parent.dateRegister).unix()
  }

  @Omit({ read: true })
  @Filter(true)
  @Type('Date')
  @Field('起始日期')
  dateStart: Date

  @Route('index')
  async listUserRegisterCount(
    parent: any,
    args: Record<string, any>,
    context: any,
    info: any
  ) {
    const dateStart = args.filter?.dateStart || '2000-01-01'
    return {
      data: await prisma.$queryRawUnsafe(
        `
        select date_trunc('day', "dateJoined") AS "dateRegister", count(*)
        from "User"
        where "dateJoined" > $1
        group by "dateRegister"
        order by "dateRegister" asc
        `,
        dayjs(dateStart).toDate()
      )
    }
  }
}
