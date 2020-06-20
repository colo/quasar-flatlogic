<template>
  <div class="dashboard-page">
    <h1 class="page-title">Virtual Hosts</h1>
    <b-row>
        <b-col xs="12">
          <Widget
            bodyClass="widget-table-overflow"
            customHeader
          >
          <q-table
            flat
            class="my-sticky-header-table"
            title="Vhosts"
            :data="vhosts"
            :columns="columns"
            :row-key="row => row.schema +'.'+ row.uri+'.'+ row.port +'.'+ row.host +'.'+ row.path"
            :pagination.sync="pagination"
            virtual-scroll
            :rows-per-page-options="[0]"
            :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
            :loading="loading"
            :filter="filter"
          >
          <!-- dark
          color="amber" -->
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
              <q-td key="schema" :props="props">
                {{ props.row.schema }}
              </q-td>
              <q-td key="uri" :props="props">
                {{ props.row.uri }}
                <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" />

              </q-td>
              <q-td key="port" :props="props">
                {{ props.row.port }}
              </q-td>
              <q-td key="host" :props="props">
                {{ props.row.host }}
              </q-td>
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
            </template>
          </q-table>
            <!-- <div class="table-responsive">
              <table class="table table-striped table-lg mb-0 requests-table">
                <thead>
                  <tr class="text-muted">
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th>DATE</th>
                    <th>CITY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in mock.table"
                    :key="row.id"
                  >
                    <td>{{row.name}}</td>
                    <td>{{row.email}}</td>
                    <td>{{row.product}}</td>
                    <td>{{row.price}}</td>
                    <td>{{row.date}}</td>
                    <td>{{row.city}}</td>
                    <td>
                      <b-button
                        :variant="row.status === 'Pending'
                          ? 'success'
                          : row.status === 'Declined' ? 'danger' : 'info'"
                        class="p-1 px-3 btn-xs"
                      >
                        {{row.status}}
                      </b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> -->
          </Widget>
        </b-col>
      </b-row>
  </div>
  <!-- <q-page> -->
    <!-- <div class="q-pa-md"> -->

    <!-- </div> -->

  <!-- </q-page> -->
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@components/flatlogic/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:vhosts')

import JSPipeline from 'js-pipeline'
import PeriodicalPipeline from '@apps/vhosts/pipelines/periodical/index'

import * as PeriodicalSources from '@apps/vhosts/sources/periodical/index'

import DataSourcesMixin from '@components/mixins/dataSources'

import moment from 'moment'

export default {
  mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,

  name: 'Vhosts',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      vhosts: [],

      filter: '',
      loading: true,
      allColumns: ['schema', 'uri', 'port', 'host', 'timestamp', 'path'],
      visibleColumns: ['schema', 'uri'],
      pagination: {
        rowsPerPage: 50
      },
      columns: [
        { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'uri',
          required: true,
          label: 'URI',
          align: 'left',
          field: 'uri',
          // field: row => row.name,
          // format: val => `${val}`,
          sortable: true
          // classes: 'bg-grey-2 ellipsis',
          // style: 'max-width: 100px',
          // headerClasses: 'bg-secondary text-white'
        },
        { name: 'port', align: 'left', label: 'Port', field: 'port', sortable: true },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        {
          name: 'timestamp',
          align: 'left',
          label: 'Last Update',
          field: 'timestamp',
          sortable: true
          // format: (val, row) => `${val}%`
          // format: val => moment(val).format('dddd, MMMM Do YYYY, h:mm:ss a')
        },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      // sortedBy: { uri: 'asc' },

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: [
        'input.vhosts.periodical',
      ],

      id: 'vhosts',
      path: 'all',

      components: {
        'input.vhosts.periodical': {
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
