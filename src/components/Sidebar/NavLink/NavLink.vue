<template>
  <li v-if="!childrenLinks && isHeader" :class="{headerLink: true, className}">
    <router-link :to="link" class="sidebar-link">
      <span class="icon">
        <i :class="fullIconName"></i>
      </span>
      {{header}} <sup v-if="label" :class="'text-' + labelColor" class="headerLabel">{{label}}</sup>
      <b-badge v-if="badge" variant="primary" pill>{{badge}}</b-badge>
    </router-link>
  </li>
  <li v-else-if="childrenLinks" :class="{headerLink: true, className}">
    <!-- <div> -->
      <router-link :to="link" event="" class="d-flex sidebar-link">
        <span class="icon">
          <i :class="fullIconName"></i>
        </span>
        {{header}} <sup v-if="label" :class="'text-' + labelColor" class="ml-1 headerLabel">{{label}}</sup>
        <div :class="{caretWrapper: true, carretActive: isActive}" @click="() => togglePanelCollapse(link)">
          <i class="fa fa-angle-left" />
        </div>
      </router-link>
    <!-- </div> -->
    <b-collapse :id="'collapse' + index" :visible="isActive">
      <ul class="sub-menu">
        <NavLink v-for="link in childrenLinks"
          :activeItem="activeItem"
          :header="link.header"
          :index="link.index"
          :link="link.link"
          :childrenLinks="link.childrenLinks"
          :key="(typeof link.link === 'string') ? link.link : link.name"
        />
      </ul>
    </b-collapse>
  </li>
  <li v-else>
    <router-link :to="index !== 'menu' && link">
      {{header}} <sup v-if="label" :class="'text-' + labelColor" class="headerLabel">{{label}}</sup>
    </router-link>
  </li>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:Sidebar:NavLink')

import { mapActions } from 'vuex'

export default {
  name: 'NavLink',
  props: {
    badge: { type: String, dafault: '' },
    header: { type: String, default: '' },
    iconName: { type: String, default: '' },
    headerLink: { type: String, default: '' },
    link: {
      type: [String, Object],
      default: () => ({})
    },
    childrenLinks: { type: Array, default: null },
    className: { type: String, default: '' },
    isHeader: { type: Boolean, default: false },
    deep: { type: Number, default: 0 },
    activeItem: {
      type: [String, Object],
      default: () => ({})
    },
    label: { type: String },
    labelColor: { type: String, default: 'warning' },
    index: { type: String },
  },
  data () {
    return {
      headerLinkWasClicked: true,
    }
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive']),
    togglePanelCollapse (link) {
      this.changeSidebarActive(link)
      this.headerLinkWasClicked = !this.headerLinkWasClicked ||
      (this.activeItem.name && this.activeItem.name.indexOf(this.index) > -1)
      // !this.activeItem.includes(this.index)
    },
  },
  computed: {
    fullIconName () {
      return `fi ${this.iconName}`
    },
    isActive () {
      debug('isActive', this.activeItem, this.index)
      return (this.activeItem &&
        this.activeItem.name && this.activeItem.name.indexOf(this.index) > -1 &&
        // this.activeItem.includes(this.index) &&
        this.headerLinkWasClicked)
    },
  },
}
</script>

<style src="./NavLink.scss" lang="scss" scoped />
