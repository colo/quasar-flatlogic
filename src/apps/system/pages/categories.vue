<template>
  <div class="dashboard-page">
    <h1 class="page-title">System</h1>
    <b-row>
      <b-col xs="12">
        <template v-for="(category_hosts, category_name) in categories_paths">
          <system-category-card
            :key="category_name"
            v-if="!category || category_name === category"
            :hosts="category_hosts"
            :category="category_name"
          />
        </template>

        <router-view :key="$route.path +'.'+ JSON.stringify($route.query)"></router-view>

        <template v-for="(category_hosts, category_name) in categories_paths">
          <system-category-card
            :key="category_name+'.bottom'"
            v-if="category_name === category"
            :hosts="category_hosts"
            :category="category_name"
          />
        </template>

      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:pages:categories')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/system/pipelines/categories'

import DataSourcesMixin from '@components/mixins/dataSources'

import SystemCategoryCard from '@apps/system/components/categoryCard.vue'

import { requests, store } from '@apps/system/sources/categories/index'

export default {
  mixins: [DataSourcesMixin],
  components: { SystemCategoryCard },
  // extends: DataSourcesMixin,

  name: 'SystemCategories',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      // category: undefined,
      categories_paths: {},
      paths: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.system.categories',

      id: 'system.categories',
      path: 'all',

      components: {
        'all': [
          {
            source: {
              requests: requests

              // store: store
            }
          }

        ]
      }
    }
  },
  computed: {
    'category': function () {
      return (this.$route && this.$route.params && this.$route.params.category) ? this.$route.params.category : undefined
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.system.categories'] && this.$options.pipelines['input.system.categories'].get_input_by_id('input.system.categories')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.system.categories'].get_input_by_id('input.system.categories').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.system.categories'].get_input_by_id('input.system.categories').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.system.categories'].get_input_by_id('input.system.categories').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.system.categories'].get_input_by_id('input.system.categories').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id

        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
        Array.each(template.input[0].poll.conn, function (conn, index) {
          template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.components)
        }.bind(this))

        let pipe = new JSPipeline(template)

        this.$options.__pipelines_cfg[pipeline_id] = {
          ids: [],
          connected: [],
          suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
        }

        // this.__after_connect_inputs(
        //   pipe,
        //   this.$options.__pipelines_cfg[pipeline_id],
        //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
        //     debug('__resume_pipeline CALLBACK')
        //     pipe.fireEvent('onOnce')
        //   }], this)
        // )

        this.$options.pipelines[pipeline_id] = pipe

        debug('create_pipelines %o', this.$options.pipelines)

        if (next) { next() }
      }
    }

    /**
    * @end pipelines
    **/

  }
}
</script>
