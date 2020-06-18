<template>
  <div class="sidebar-wrapper">
    <nav
        :class="{sidebar: true, sidebarStatic, sidebarOpened}"
        @mouseenter="sidebarMouseEnter"
        @mouseleave="sidebarMouseLeave"
    >
      <header class="logo">
        <router-link to="/app"><span class="primary-word">Sing</span> App</router-link>
      </header>
      <ul class="nav">
        <!-- {{route}} -->
        <NavLink
          v-for="route in routes"
          :key="route.meta.breadcrumb.label+'.navlink'"
          :activeItem="activeItem"
          :header="route.meta.breadcrumb.label"
          :link="{name: route.name }"
          :iconName="route.meta.breadcrumb.icon"
          :index="route.meta.breadcrumb.label.toLowerCase()"
          isHeader
          :childrenLinks="route.meta.breadcrumb.children"
        />
        <!-- <NavLink
            :activeItem="activeItem"
            header="Typography"
            link="/app/typography"
            iconName="flaticon-list"
            index="typography"
            isHeader
        />
        <NavLink
            :activeItem="activeItem"
            header="Tables Basic"
            link="/app/tables"
            iconName="flaticon-equal-1"
            index="tables"
            isHeader
        />
        <NavLink
            :activeItem="activeItem"
            header="Notifications"
            link="/app/notifications"
            iconName="flaticon-star"
            index="notifications"
            isHeader
        />
        <NavLink
            :activeItem="activeItem"
            header="Components"
            link="/app/components"
            iconName="flaticon-network"
            index="components"
            :childrenLinks="[
              { header: 'Charts', link: '/app/components/charts' },
              { header: 'Icons', link: '/app/components/icons' },
              { header: 'Maps', link: '/app/components/maps' },
            ]"
        />
        -->
      </ul>
      <p>
      <h5 class="navTitle">
        LABELS
        <a class="actionLink">
          <i class="la la-plus float-right"/>
        </a>
      </h5>
      <ul class="sidebarLabels">
        <li>
          <a href="#">
            <i class="fa fa-circle text-danger mr-2"/>
            <span class="labelName">My Recent</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-circle text-primary mr-2"/>
            <span class="labelName">Starred</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-circle mr-2"/>
            <span class="labelName">Background</span>
          </a>
        </li>
      </ul>
      <h5 class="navTitle">
        PROJECTS
      </h5>
      <div class="sidebarAlerts">
        <b-alert
            v-for="alert in alerts"
            :key="alert.id"
            class="sidebarAlert" variant="transparent"
            show dismissible
        >
          <span>{{alert.title}}</span><br/>
          <b-progress class="sidebarProgress progress-xs mt-1"
                      :variant="alert.color" :value="alert.value" :max="100"/>
          <small>{{alert.footer}}</small>
        </b-alert>
      </div>
    </nav>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:Sidebar')

import { mapState, mapActions } from 'vuex'
import isScreen from '@libs/screenHelper'
import NavLink from './NavLink/NavLink'

import Routes from '../../router/routes'

export default {
  name: 'Sidebar',
  components: { NavLink },
  data () {
    return {

      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'danger',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'primary',
        },
      ],
    }
  },

  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute () {
      const paths = this.$route.fullPath.split('/')
      paths.pop()
      this.changeSidebarActive(paths.join('/'))
    },
    sidebarMouseEnter () {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(false)
        this.setActiveByRoute()
      }
    },
    sidebarMouseLeave () {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(true)
        this.changeSidebarActive(null)
      }
    },
    __append_routes: function (routes, dest) {
      routes.forEach(function (route) {
        if (route && route.meta && route.meta.breadcrumb && route.meta.breadcrumb.navbar === true) {
          if (route.children) {
            route.children.forEach(function (child) {
              // debug('Route', child)
              if (child && child.meta && child.meta.breadcrumb && child.meta.breadcrumb.navbar === true) {
                if (!route.meta.breadcrumb.children) route.meta.breadcrumb.children = []
                if (route.meta.breadcrumb.children.every(function (_child) {
                  debug('every', _child, child)
                  return _child.header !== child.meta.breadcrumb.label
                })
                ) {
                  let link = (child.name) ? {name: child.name} : '/' + route.path + '/' + child.path
                  route.meta.breadcrumb.children.push({header: child.meta.breadcrumb.label, link: link})
                }
              }
            })
          }

          dest.push(route)
        } else if (route && route.children) {
          this.__append_routes(route.children, dest)
          // route.children.forEach(function (child) {
          //   this.__append_routes(child)
          // //   // debug('Route', child)
          // //   if (child && child.meta && child.meta.breadcrumb) {
          // //     routes.push(child)
          // //   }
          // }.bind(this))
        }
      }.bind(this))
    }
  },
  created () {
    debug('life cycle created', this.$route, Routes)
    this.setActiveByRoute()
  },
  computed: {
    routes: function () {
      let routes = []
      this.__append_routes(Routes, routes)
      // // return Routes.filter(function (route) {
      // //   return route && route.meta && route.meta.breadcrumb
      // // })
      //
      // Routes.forEach(function (route) {
      //   // debug('Route', route)
      //   let _route = this.process_route(route)
      //   if (_route) { routes.push(route) }
      // }.bind(this))
      //
      // debug('Routes %o', routes)
      //
      return routes
    },
    ...mapState('layout', {
      sidebarStatic: state => state.sidebarStatic,
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
}
</script>

<style src="./Sidebar.scss" lang="scss" scoped/>
