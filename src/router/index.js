import Vue from 'vue'
import Router from 'vue-router'

//webpack 按需加载
const Login = r => require.ensure([], () => r(require('../components/Login')), 'Login')
const Main = r => require.ensure([], () => r(require('../components/Main')), 'Main')
const anyproxy = r => require.ensure([], () => r(require('../components/anyproxy')), 'anyproxy')
const dataHub = r => require.ensure([], () => r(require('../components/dataHub')), 'dataHub')
const adminInfo = r => require.ensure([], () => r(require('../components/adminInfo')), 'adminInfo')
const apiList = r => require.ensure([], () => r(require('../components/InfoTab/apiList')), 'apiList')
const reqList = r => require.ensure([], () => r(require('../components/InfoTab/reqList')), 'reqList')
const guide = r => require.ensure([], () => r(require('../components/guide')), 'guide')

Vue.use(Router);

//路由表
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          redirect: 'anyproxy'
        },
        {
          path: 'adminInfo',
          component: adminInfo
        },
        {
          path: 'anyproxy',
          component: anyproxy
        },
        {
          path: 'dataHub',
          component: dataHub,
          children: [
            {
              path: '',
              redirect: 'reqList'
            },
            {
              path: 'apiList',
              component: apiList,
            },
            {
              path: 'reqList',
              component: reqList,
            }
          ]
        },
        {
          path:'guide',
          component:guide
        }
      ]
    }
  ]
})
