<template>
  <Widget
  >

    <b-button-toolbar key-nav aria-label="Toolbar with button groups" :justified="true">
      <b-button-group class="mx-1">
        <b-button
          variant="primary"
          :to="{
            name: 'system_category',
            params: { category: category },
          }"
        >
          {{category}}
        </b-button>
      </b-button-group>
      <b-button-group class="mx-1" size="sm">
        <b-button
          variant="outline-info"
          v-for="host in hosts"
          :key="category+'.'+host"
          :href="'/system/categories/'+category+'#'+host"
        >
        <!-- :to="{
          name: 'system_host',
          params: { host: host },
          hash: '#'+category
        }" -->
          {{host}}
        </b-button>
      </b-button-group>
    </b-button-toolbar>
  </Widget>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:components:categoryCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/system/pipelines/index'

// import DataSourcesMixin from '@mixins/dataSources'

// import { requests, store } from './sources/index'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,

  name: 'OsCategoryCard',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,
  props: {
    category: {
      type: String,
      default: ''
    },
    hosts: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {

    }
  }

}
</script>
