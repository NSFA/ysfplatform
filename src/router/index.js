import Vue from 'vue'
import Router from 'vue-router'

//webpack 按需加载
const Login = r => require.ensure([], () => r(require('../components/Login')), 'Login')
const Main = r => require.ensure([], () => r(require('../components/Main')), 'Main')
const terminal = r => require.ensure([], () => r(require('../components/anyproxy')), 'anyproxy')
const dataHub = r => require.ensure([], () => r(require('../components/dataHub')), 'dataHub')
const adminInfo = r => require.ensure([], () => r(require('../components/InfoTab/adminInfo')), 'adminInfo')
const userInfo = r => require.ensure([], () => r(require('../components/InfoTab/userInfo')), 'userInfo')
const terminalInfo = r => require.ensure([], () => r(require('../components/InfoTab/terminalInfo')), 'terminalInfo')
const analyzeInfo = r => require.ensure([], () => r(require('../components/InfoTab/analyzeInfo')), 'analyzeInfo')
const pictureInfo = r => require.ensure([], () => r(require('../components/InfoTab/pictureInfo')), 'pictureInfo')
const unknowInfo = r => require.ensure([], () => r(require('../components/InfoTab/unknowInfo')), 'unknowInfo')


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
          path: 'anyproxy',
          component: terminal
        },
        {
          path: 'dataHub',
          component: dataHub,
          children: [
            {
              path: '',
              redirect: 'userInfo'
            },
            {
              path: 'userInfo',
              component: userInfo,
            },
            {
              path: 'adminInfo',
              component: adminInfo
            },
            {
              path: 'terminalInfo',
              component: terminalInfo
            },
            {
              path: 'unknowInfo',
              component: unknowInfo
            },
            {
              path: 'analyzeInfo',
              component: analyzeInfo
            },
            {
              path: 'pictureInfo',
              component: pictureInfo
            }
          ]
        }
      ]
    }
  ]
})
