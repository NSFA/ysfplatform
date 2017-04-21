import Vue from 'vue'
import Router from 'vue-router'

//webpack 按需加载
const Login = r => require.ensure([], () => r(require('../components/page/Login')), 'Login');
const Main = r => require.ensure([], () => r(require('../components/page/Main')), 'Main');
const proxy = r => require.ensure([], () => r(require('../components/page/proxy')), 'proxy');
const api = r => require.ensure([], () => r(require('../components/page/api')), 'api');
const monitoring = r => require.ensure([], () => r(require('../components/page/monitoring')), 'monitoring');
const updateRecord = r => require.ensure([], () => r(require('../components/page/updateRecord')), 'updateRecord');
const resList = r => require.ensure([], () => r(require('../components/list/resList')), 'resList');
const reqList = r => require.ensure([], () => r(require('../components/list/reqList')), 'reqList');
const guide = r => require.ensure([], () => r(require('../components/page/guide')), 'guide');

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
          redirect: 'proxy'
        },
        {
          path: 'monitoring',
          component: monitoring
        },
        {
          path: 'proxy',
          component: proxy
        },
        {
          path: 'api',
          component: api,
          children: [
            {
              path: '',
              redirect: 'reqList'
            },
            {
              path: 'resList',
              component: resList,
            },
            {
              path: 'reqList',
              component: reqList,
            }
          ]
        },
        {
          path: 'guide',
          component: guide
        },
        {
          path:'updateRecord',
          component: updateRecord
        }
      ]
    }
  ]
})
