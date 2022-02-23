interface LocaleMap {
  [locale: string]: {
    app?: { [key: string]: string }
  }
}

export const translations: LocaleMap = {
  en: {
    app: {
      id: 'ID',
      dateJoined: 'Date joined'
    }
  },
  'zh-cn': {
    app: {
      id: 'ID',
      User: '用户',
      Permission: '权限',
      Group: '用户组',
      Token: 'Token',
      email: '邮箱',
      username: '账号',
      password: '密码',
      nickname: '昵称',
      gender: '性别',
      tel: '电话',
      Superuser: '超级用户',
      dateJoined: '注册时间',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      groups: '用户组',
      permissions: '权限项',
      'Permission name': '权限名',
      'Group name': '用户组',
      'Resource List': '资源列表',
      Name: '名称',
      Link: '地址',
      Male: '男',
      Female: '女',
      'is staff': '员工'
    }
  }
}
