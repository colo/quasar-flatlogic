
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
          breadcrumb: { label: 'Dashboard', icon: 'fi flaticon-home', navbar: true }
        },
      },
      {
        name: 'system',
        path: 'system',
        // component: () => import(/* webpackChunkName: "system" */ 'pages/Dashboard/Dashboard'),
        redirect: { name: 'system_hosts' },

        meta: {
          breadcrumb: { label: 'System', icon: 'fi flaticon-server', navbar: true }
        },
        children: [
          {
            path: 'hosts',
            name: 'system_hosts',
            component: () => import(/* webpackChunkName: "system.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Hosts', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':host',
                name: 'system_host',
                component: () => import(/* webpackChunkName: "system.host" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Host', icon: 'widgets' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'system_categories',
            component: () => import(/* webpackChunkName: "system.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Categories', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':category',
                name: 'system_category',
                component: () => import(/* webpackChunkName: "system.category" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Category', icon: 'widgets', app: 'system' }
                }
              }
            ]
          }

        ]
      },
      {
        path: 'logs',
        name: 'logs',
        redirect: { name: 'logs_all' },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "logs" */ 'pages/Dashboard/Dashboard'),
        meta: {
          breadcrumb: { label: 'Logs', icon: 'fa fa-file-text-o', navbar: true }
        },

        children: [
          {
            path: '',
            name: 'logs_all',
            // redirect: { name: 'logs_all' },
            component: () => import(/* webpackChunkName: "logs.all" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'All', icon: 'widgets', navbar: false }
            }

          },
          {
            path: 'educativa',
            name: 'logs_educativa',
            // redirect: { name: 'logs_educativa_all' },
            component: () => import(/* webpackChunkName: "logs.educativa" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Educativa', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: '',
                name: 'logs_educativa_all',
                component: () => import(/* webpackChunkName: "logs.educativa.all" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Educativa All', icon: 'widgets', navbar: false }
                }
              },
              {
                path: 'filter',
                name: 'logs_educativa_filter',
                component: () => import(/* webpackChunkName: "logs.educativa.filter" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Educativa Filter', icon: 'widgets', navbar: false }
                }
              }
            ]
          },
          {
            path: 'web',
            name: 'logs_web',
            // redirect: { name: 'logs_web_all' },
            component: () => import(/* webpackChunkName: "logs.web" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Web', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: '',
                name: 'logs_web_all',
                component: () => import(/* webpackChunkName: "logs.weba.ll" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Web All', icon: 'widgets', navbar: false }
                }
              },
              {
                path: 'filter',
                name: 'logs_web_filter',
                component: () => import(/* webpackChunkName: "logs.web.filter" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Web Filter', icon: 'widgets', navbar: false }
                }
              }
            ]
          }

        ]
      },
      {
        name: 'munin',
        path: 'munin',
        // component: () => import(/* webpackChunkName: "munin" */ 'pages/Dashboard/Dashboard'),
        redirect: { name: 'munin_hosts' },

        meta: {
          breadcrumb: { label: 'Munin', icon: 'fa fa-bar-chart-o', navbar: true }
        },
        children: [
          {
            path: 'hosts',
            name: 'munin_hosts',
            component: () => import(/* webpackChunkName: "munin.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Hosts', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':host',
                name: 'munin_host',
                component: () => import(/* webpackChunkName: "munin.host" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Host', icon: 'widgets' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'munin_categories',
            component: () => import(/* webpackChunkName: "munin.hosts" */ 'pages/Dashboard/Dashboard'),
            meta: {
              breadcrumb: { label: 'Categories', icon: 'widgets', navbar: true }
            },
            children: [
              {
                path: ':category',
                name: 'munin_category',
                component: () => import(/* webpackChunkName: "munin.category" */ 'pages/Dashboard/Dashboard'),
                meta: {
                  breadcrumb: { label: 'Category', icon: 'widgets', app: 'munin' }
                }
              }
            ]
          }

        ]
      },
      {
        path: '/vhosts',
        name: 'vhosts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "vhosts" */ '@apps/vhosts/index.vue'),
        meta: {
          breadcrumb: { label: 'Vhosts', icon: 'glyphicon glyphicon-link', navbar: true }
        }

      },
      {
        path: '/checks',
        name: 'checks',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "checks" */ '@apps/checks/index.vue'),
        meta: {
          breadcrumb: { label: 'Checks', icon: 'fa fa-check', navbar: true }
        }

      },
      {
        path: '/alerts',
        name: 'alerts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "alerts" */ '@apps/alerts/index.vue'),
        component: () => import(/* webpackChunkName: "alerts" */ 'pages/Dashboard/Dashboard'),
        meta: {
          breadcrumb: { label: 'Alerts', icon: 'fa fa-fire', navbar: true }
        }

      },
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
