<template>
  <q-card>
    <q-card-section class="bg-primary">
      <q-btn
        flat
        :to="{
          name: 'system_category',
          params: { category: category },
        }"
      >
      {{category}}
    </q-btn>

    </q-card-section>

    <!-- <q-card-section>
      {{ lorem }}
    </q-card-section> -->

    <q-separator dark />

    <q-card-actions>
      <q-btn
        v-for="host in hosts"
        :key="category+'.'+host"
        flat
        :to="{
          name: 'system_category',
          params: { category: category },
          hash: '#'+host
        }"
      >{{host}}</q-btn>
    </q-card-actions>
  </q-card>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:components:categoryCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/system/pipelines/index'

// import DataSourcesMixin from '@components/mixins/dataSources'

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
