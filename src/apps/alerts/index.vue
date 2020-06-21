<template>
  <div class="dashboard-page">
    <h1 class="page-title">Alerts</h1>
    <b-row>
        <b-col xs="12">
          <Widget
            customHeader
          >
          <!-- bodyClass="widget-table-overflow" -->

            <q-table
              flat
              :table-class="'my-sticky-header-table'"
              title="Alerts"
              :data="alerts"
              :columns="columns"
              :row-key="row => row.host +'.'+ row.alert+'.'+ row.path +'.'+ row.timestamp"
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
                  <q-toggle v-model="visibleColumns" val="hostname" label="URI" />
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
                <!-- <q-td key="status" :props="props">
                  <q-icon :name="(props.row.code >= 399 || props.row.errno) ? 'error_outline' : 'alert_circle_outline' " size="md" :class="(props.row.code >= 399 || props.row.errno) ?  'text-negative' : 'text-positive'"/>
                </q-td> -->
                <q-td key="host" :props="props">
                  {{ props.row.host }}
                </q-td>
                <q-td key="alert" :props="props">
                  <b-button variant="link" @click="props.expand = !props.expand">
                    <i :class="props.expand ? 'fa fa-sort-asc' : 'fa fa-sort-desc'"></i>
                  </b-button>
                  {{ props.row.alert }}
                  <!-- <q-btn dense round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" /> -->
                  <!-- <q-space /> -->
                  <!-- <q-btn type="a" v-if="/^http/.test(props.row.protocol)" :href="props.row.protocol+'//'+props.row.hostname+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->

                </q-td>
                <!-- <q-td key="timestamp" :props="props">
                  {{ props.row.timestamp }}
                </q-td> -->
                <q-td key="timestamp" :props="props">
                  {{ format_time(props.row.timestamp) }}
                  <!-- <div v-text="format_time(props.row.timestamp)"></div> -->
                  <!-- {{ props.cols[4].format }} -->
                  <!-- {{ props.row.timestamp }} -->
                </q-td>
                <q-td key="path" :props="props">
                  {{ props.row.path }}
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <!-- <div class="text-left">{{ props.row }}.</div> -->
                  <json-viewer :value="props.row.data" theme="my-awesome-json-theme" :expand-depth="2" copyable></json-viewer>
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
const debug = Debug('apps:alerts')

import JsonViewer from 'vue-json-viewer'

import JSPipeline from 'js-pipeline'
import PeriodicalPipeline from '@apps/alerts/pipelines/periodical/index'
import * as PeriodicalSources from '@apps/alerts/sources/periodical/index'

import DataSourcesMixin from '@components/mixins/dataSources'

import moment from 'moment'

export default {
  mixins: [DataSourcesMixin],

  components: { JsonViewer },
  // extends: DataSourcesMixin,

  name: 'Alerts',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      alerts: [],

      filter: '',
      loading: true,
      allColumns: ['host', 'alert', 'timestamp', 'path'],
      visibleColumns: ['alert'],
      pagination: {
        rowsPerPage: 50
      },
      columns: [
        // { name: 'status',
        //   label: 'Status',
        //   sort: (a, b, rowA, rowB) => {
        //     return ((a.code >= 399 || a.errno) && (b.code < 399 || !b.errno)) ? 1 : ((b.code >= 399 || b.errno) && (a.code < 399 || !a.errno)) ? -1 : 0
        //   },
        //   field: (row) => row,
        //   // format: (val, row) => {
        //   //   // debug('format status', val, row)
        //   //   if (row.code >= 399 || row.errno) {
        //   //     return false
        //   //   } else {
        //   //     return true
        //   //   }
        //   // },
        //   sortable: true,
        //   align: 'left'
        // },
        // { name: 'protocol', label: 'Protocol', field: 'protocol', sortable: true, align: 'left' },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        {
          name: 'alert',
          required: true,
          label: 'Alert',
          align: 'left',
          field: 'alert',
          // field: row => row.name,
          // format: val => `${val}`,
          sortable: true
          // classes: 'bg-grey-2 ellipsis',
          // style: 'max-width: 100px',
          // headerClasses: 'bg-secondary text-white'
        },
        // { name: 'port', align: 'left', label: 'Port', field: 'port', sortable: true },
        //
        { name: 'timestamp', align: 'left', label: 'Last Update', field: 'timestamp', sortable: true },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      // sortedBy: { hostname: 'asc' },

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: [
        'input.alerts.periodical',
      ],

      id: 'alerts',
      path: 'all',

      components: {
        'input.alerts.periodical': {
          range: {
            source: {
              requests: PeriodicalSources.requests
              // store: store
            }
          }
        }
      }
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.alerts.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.o.periodicals.host.periodical'] data&
      //   this.$options.pipelines['input.os.host.periodical'].get_input_by_id('input.os.host.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [PeriodicalPipeline] //, HourPipeline, DayPipeline
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
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
        }
      }.bind(this))

      debug('create_pipelines %o', this.$options.pipelines)

      if (next) { next() }
      // }
    },

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

<style lang="css">
// values are default one from jv-light template
.my-awesome-json-theme {
  background: #1d1d1d;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button { color: #49b3ff }
  .jv-key { color: #111111 }
  .jv-item {
    &.jv-array { color: #111111 }
    &.jv-boolean { color: #fc1e70 }
    &.jv-function { color: #067bca }
    &.jv-number { color: #fc1e70 }
    &.jv-object { color: #111111 }
    &.jv-undefined { color: #e08331 }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
