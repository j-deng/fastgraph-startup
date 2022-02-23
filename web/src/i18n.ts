import { createI18n } from 'vue-i18n'

const zhCN = {
  Yes: '是',
  No: '否',
  Edit: '编辑',
  View: '详情',
  Operation: '操作',
  Resources: '资源',
  Submit: '保存',
  Cancel: '取消',
  Delete: '删除',
  Success: '成功',
  More: '更多',
  Search: '查询',
  Clear: '重置',
  Collapse: '展开',
  'Add record': '新增',
  'Delete {n} record': '批量删除 | 删除 {n} 条数据 | 删除 {n} 条数据',
  'Are you sure to delete?': '请确认是否删除？',
  'Please select': '请选择',
  Home: '首页',
  Profile: '个人信息',
  Login: '登陆',
  Logout: '退出',
  'Welcome, {name}': '欢迎您，{name}',
  Username: '用户名',
  Password: '密码',
  Nickname: '昵称',
  Gender: '性别',
  'Password setting': '设置密码',
  'User account': '用户账号',
  'Login password': '登录密码',
  'Confirm password': '确认密码',
  'System Control': '系统管理',
  'User Control': '用户管理',
  'User Group': '角色管理',
  'Permission List': '权限管理',
  'Old password': '原密码',
  'My profile': '基本信息',
  'Old password is required': '请填写原密码',
  'New password is required': '请填写密码和确认密码',
  'Confirm password is required': '两次输入的密码不一致',
  'Welcome back!': '欢迎回来！',
  'You are logged out.': '您已安全退出。',
  'Please confirm to log out?': '请确认退出登录？',
  'Resource not available...': '资源不可用'
}

const messages: { [locale: string]: any } = {
  'zh-cn': zhCN,
  en: {
    ...Object.fromEntries(Object.keys(zhCN).map((key) => [key, key])),
    'Delete {n} record':
      'Delete record | Delete one record | Delete {n} records'
  }
}

const defaultLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
  locale: defaultLocale, // set locale
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages
})

export const setLocale = (val: string) => {
  localStorage.setItem('locale', val)
}

export const addLocaleMessages = (newMessages: { [locale: string]: any }) => {
  Object.entries(newMessages).forEach(([lang, message]) => {
    i18n.global.setLocaleMessage(lang, { ...messages[lang], ...message })
  })
}
