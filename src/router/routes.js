
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/Login/Login'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'dashboard' },
    meta: {
      breadcrumb: { label: 'Home', icon: 'flaticon-home', navbar: false }
    },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ 'pages/Dashboard/Dashboard'),
        meta: {
          breadcrumb: { label: 'Dashboard', icon: 'flaticon-home', navbar: true }
        },
      },
      {
        name: 'system',
        path: 'system',
        component: () => import(/* webpackChunkName: "system" */ 'pages/Dashboard/Dashboard'),
        redirect: { name: 'system_hosts' },

        meta: {
          breadcrumb: { label: 'System', icon: 'flaticon-server', navbar: true }
        },
        children: [
          {
            path: 'hosts',
            name: 'system_hosts',
            component: () => import(/* webpackChunkName: "system.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'System Hosts', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':host',
                name: 'system_host',
                component: () => import(/* webpackChunkName: "system.host" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'System Host', icon: 'widgets' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'system_categories',
            component: () => import(/* webpackChunkName: "system.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'System Categories', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':category',
                name: 'system_category',
                component: () => import(/* webpackChunkName: "system.category" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'System Category', icon: 'widgets', app: 'system' }
                }
              }
            ]
          }

        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error/Error.vue')
  })
}

export default routes
