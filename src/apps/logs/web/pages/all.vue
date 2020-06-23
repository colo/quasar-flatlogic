<template>
  <div class="dashboard-page">
    <h1 class="page-title">Logs Web</h1>
    <b-row>
        <b-col xs="12">
          <Widget
            customHeader
          >
          <!-- bodyClass="widget-table-overflow" -->
            <q-table
              flat
              :table-class="'my-sticky-header-table'"
              title="Web Logs"
              :data="logs"
              :columns="columns"
              :row-key="row => row.domain +'.'+ row.host +'.'+ row.path"
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
              :loading="loading"
              :filter="filter"
            >
            <!-- dark
            color="amber" -->
              <template v-slot:pagination="scope">
                <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
                 <b-button-group class="mx-1" size="sm">
                   <b-button
                     v-if="scope.pagesNumber > 2"
                     :disabled="scope.isFirstPage"
                     @click="scope.firstPage"
                   >
                     <i class="fa fa-step-backward"></i>
                   </b-button>

                   <b-button
                     v-if="scope.pagesNumber > 2"
                     :disabled="scope.isFirstPage"
                     @click="scope.prevPage"
                   >
                     <i class="fa fa-backward"></i>
                   </b-button>
                 </b-button-group>
                 <b-dropdown class="mx-1" right text="Records per page">
                   <b-dropdown-item @click="pagination.rowsPerPage = 20">20</b-dropdown-item>
                   <b-dropdown-item @click="pagination.rowsPerPage = 50">50</b-dropdown-item>
                   <b-dropdown-item @click="pagination.rowsPerPage = 100">100</b-dropdown-item>
                 </b-dropdown>
                 <b-button-group class="mx-1" size="sm">
                   <b-button
                   :disabled="scope.isLastPage"
                   @click="scope.nextPage"
                   >
                     <i class="fa fa-forward"></i>
                   </b-button>

                   <b-button
                   v-if="pagesNumber > 2"
                   :disabled="scope.isLastPage"
                   @click="scope.lastPage"
                   >
                     <i class="fa fa-step-forward"></i>
                   </b-button>
                 </b-button-group>
               </b-button-toolbar>
              </template>
              <template v-slot:top="props">
                <q-select
                  v-if="$q.screen.lt.sm"
                  v-model="visibleColumns"
                  multiple
                  borderless
                  dense
                  options-dense
                  :display-value="$q.lang.table.columns"
                  emit-value
                  map-options
                  :options="columns"
                  option-value="name"
                  style="min-width: 150px"
                />
                <q-space />
                <!-- <div v-if="$q.screen.gt.xs" class="col">
                  <q-toggle v-model="visibleColumns" val="schema" label="Schema" />
                  <q-toggle v-model="visibleColumns" val="uri" label="URI" />
                  <q-toggle v-model="visibleColumns" val="port" label="Port" />
                  <q-toggle v-model="visibleColumns" val="host" label="Host" />
                  <q-toggle v-model="visibleColumns" val="timestamp" label="Last Update" />
                  <q-toggle v-model="visibleColumns" val="path" label="Type" />
                </div> -->

                <q-input borderless dense debounce="100" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn
                flat round dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md"
              />
              </template>

              <template v-slot:body="props">
                <q-tr :props="props">

                  <q-td key="View" :props="props">
                    <!-- View -->
                    <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
                    <b-button
                      size="lg"
                      variant="outline"
                      @click="destroy_pipelines()"
                      :to="'/logs/web/filter/?domain=' + props.row.domain+'&host=' + props.row.host+'&path=' + props.row.path"
                    >
                      <q-icon name="open_in_browser" />
                    </b-button>
                    <!-- <q-btn
                      v-on:click="destroy_pipelines()"
                      :to="'/logs/web/filter/?domain=' + props.row.domain+'&host=' + props.row.host+'&path=' + props.row.path"
                      flat
                      icon="open_in_browser"
                    /> -->
                  </q-td>

                  <q-td key="domain" :props="props">
                    <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
                    <b-button
                      variant="outline"
                      @click="destroy_pipelines()"
                      :to="'/logs/web/filter/?domain=' + props.row.domain"
                    >
                      {{ props.row.domain }}
                      <q-icon name="open_in_browser" />
                    </b-button>
                    <!-- <q-btn
                      v-on:click="destroy_pipelines()"
                      :to="'/logs/web/filter/?domain=' + props.row.domain"
                      flat
                      icon="open_in_browser"
                      :label="props.row.domain"
                    /> -->
                  </q-td>

                  <q-td key="host" :props="props">
                    <b-button
                      variant="outline"
                      @click="destroy_pipelines()"
                      :to="'/logs/web/filter/?host=' + props.row.host"
                    >
                      {{ props.row.host }}
                      <q-icon name="open_in_browser" />
                    </b-button>
                    <!-- <q-btn
                      v-on:click="destroy_pipelines()"
                      :to="'/logs/web/filter/?host=' + props.row.host"
                      flat
                      icon="open_in_browser"
                      :label="props.row.host"
                    /> -->
                  </q-td>
                  <!-- <q-td key="timestamp" :props="props">
                    {{ format_time(props.row.timestamp) }}
                  </q-td> -->
                  <q-td key="path" :props="props">
                    <b-button
                      variant="outline"
                      @click="destroy_pipelines()"
                      :to="'/logs/web/filter/?path=' + props.row.path"
                    >
                      {{ props.row.path }}
                      <q-icon name="open_in_browser" />
                    </b-button>
                    <!-- <q-btn
                      v-on:click="destroy_pipelines()"
                      :to="'/logs/web/filter/?path=' + props.row.path"
                      flat
                      icon="open_in_browser"
                      :label="props.row.path"
                    /> -->
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </Widget>
        </b-col>
      </b-row>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:logs:web:pages:all')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/logs/web/pipelines/all'

import DataSourcesMixin from '@components/mixins/dataSources'

// import LogsWebCard from '@apps/logs/components/webCard.vue'

import { requests, store } from '@apps/logs/web/sources/all/index'

export default {
  mixins: [DataSourcesMixin],
  // components: { LogsWebCard },
  // extends: DataSourcesMixin,

  name: 'LogsWebsAll',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,
  req_components: {
    'all': [
      {
        source: {
          requests: requests

          // store: store
        }
      }

    ]
  },

  data () {
    return {
      height: '0px',

      logs: [],

      filter: '',
      loading: true,
      allColumns: ['View', 'domain', 'host', 'path'],
      visibleColumns: ['domain'],
      pagination: {
        rowsPerPage: 50
      },

      columns: [
        { name: 'View', label: 'View', field: 'View', sortable: true, align: 'left' },
        {
          name: 'domain',
          required: true,
          label: 'Domain',
          align: 'left',
          field: 'domain',
          sortable: true
        },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        // {
        //   name: 'timestamp',
        //   align: 'left',
        //   label: 'Last Update',
        //   field: 'timestamp',
        //   sortable: true
        // },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      ],

      // logs: undefined,
      // logs_paths: {},
      // paths: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.logs.web.all',

      id: 'logs.web.all',
      path: 'all',

      // components: {
      //   'all': [
      //     {
      //       source: {
      //         requests: requests
      //
      //         // store: store
      //       }
      //     }
      //
      //   ]
      // }
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.logs.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.logs.web.all'] && this.$options.pipelines['input.logs.web.all'].get_input_by_id('input.logs.web.all')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.logs.web.all'].get_input_by_id('input.logs.web.all').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.logs.web.all'].get_input_by_id('input.logs.web.all').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.logs.web.all'].get_input_by_id('input.logs.web.all').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.logs.web.all'].get_input_by_id('input.logs.web.all').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id

        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
        Array.each(template.input[0].poll.conn, function (conn, index) {
          template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options.req_components)
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

<style lang="css" scoped>
.my-sticky-header-table {
/* height or max-height is important */
height: 310px;
/* this is when the loading indicator appears */;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
/* bg color is important for th; just specify one */
background-color: #c1f4cd;
}

.my-sticky-header-table thead tr th {
position: sticky;
z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
top: 0;
}

.my-sticky-header-table.q-table--loading thead tr:last-child th {
/* height of all previous header rows */
top: 48px;
}
</style>
