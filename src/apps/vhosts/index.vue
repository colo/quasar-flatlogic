<template>
  <div class="dashboard-page">
    <h1 class="page-title">Virtual Hosts</h1>
    <!-- <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
              <template v-slot:first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Initial sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="initialSortSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="sortDirection"
            id="initialSortSelect"
            size="sm"
            :options="['asc', 'desc', 'last']"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Leave all unchecked to filter on all data"
          class="mb-0">
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="name">Name</b-form-checkbox>
            <b-form-checkbox value="age">Age</b-form-checkbox>
            <b-form-checkbox value="isActive">Active</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row> -->
      <b-row>
        <b-col xs="12">
          <Widget
            customHeader
          >
          <!-- bodyClass="widget-table-overflow" -->
            <q-table
              flat
              :table-class="'my-sticky-header-table'"
              title="Vhosts"
              :data="vhosts"
              :columns="columns"
              :row-key="row => row.schema +'.'+ row.uri+'.'+ row.port +'.'+ row.host +'.'+ row.path"
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
              :loading="loading"
              :filter="filter"
            >
            <!-- virtual-scroll -->
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
                  <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
                  <b-button variant="link" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank">
                    <i class="fa fa-external-link"></i>
                  </b-button>
                </q-td>
                <q-td key="port" :props="props">
                  {{ props.row.port }}
                </q-td>
                <q-td key="host" :props="props">
                  {{ props.row.host }}
                </q-td>
                <q-td key="timestamp" :props="props">
                  {{ format_time(props.row.timestamp) }}
                </q-td>
                <q-td key="path" :props="props">
                  {{ props.row.path }}
                </q-td>
              </q-tr>
              </template>
            </q-table>

            <!-- Main table element -->
            <!-- <b-table
              show-empty
              small
              stacked="md"
              :items="vhosts"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :filterIncludedFields="filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              @filtered="onFiltered"
            >
              <template v-slot:cell(name)="row">
                {{ row.value.first }} {{ row.value.last }}
              </template>

              <template v-slot:cell(actions)="row">
                <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                  Info modal
                </b-button>
                <b-button size="sm" @click="row.toggleDetails">
                  {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                </b-button>
              </template>

              <template v-slot:row-details="row">
                <b-card>
                  <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                  </ul>
                </b-card>
              </template>
            </b-table> -->

          </Widget>

          <!-- Info modal -->
          <!-- <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
            <pre>{{ infoModal.content }}</pre>
          </b-modal> -->
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

  // computed: {
  //   sortOptions () {
  //     // Create an options list from our fields
  //     return this.fields
  //       .filter(f => f.sortable)
  //       .map(f => {
  //         return { text: f.label, value: f.key }
  //       })
  //   }
  // },
  // mounted () {
  //   // Set the initial number of items
  //   this.totalRows = this.vhosts.length
  // },

  req_components: {
    'input.vhosts.periodical': {
      range: {
        source: {
          requests: PeriodicalSources.requests
          // store: store
        }
      }
    }
  },

  data () {
    return {
      height: '0px',

      vhosts: [],

      /**
      * b-table
      **/
      // items: [
      //   { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
      //   { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
      //   {
      //     isActive: false,
      //     age: 9,
      //     name: { first: 'Mini', last: 'Navarro' },
      //     _rowVariant: 'success'
      //   },
      //   { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
      //   { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
      //   { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
      //   { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
      //   {
      //     isActive: true,
      //     age: 87,
      //     name: { first: 'Larsen', last: 'Shaw' },
      //     _cellVariants: { age: 'danger', isActive: 'warning' }
      //   },
      //   { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
      //   { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
      //   { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
      //   { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
      // ],
      // fields: [
      //   { key: 'schema', label: 'Schema', sortable: true }, //, sortDirection: 'desc'
      //   { key: 'uri', label: 'URI', sortable: true, class: 'text-center' },
      //   {
      //     key: 'timestamp',
      //     label: 'Last Update',
      //     formatter: (timestamp, key, item) => {
      //       return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
      //     },
      //     sortable: true,
      //     // sortByFormatted: true,
      //     filterByFormatted: true
      //   },
      //   { key: 'actions', label: 'Actions' }
      // ],
      // totalRows: 1,
      // currentPage: 1,
      // perPage: 25,
      // pageOptions: [25, 50, 100],
      // sortBy: '',
      // sortDesc: false,
      // sortDirection: 'asc',
      // filter: null,
      // filterOn: [],
      // infoModal: {
      //   id: 'info-modal',
      //   title: '',
      //   content: ''
      // },
      /**
      * b-table
      **/

      /**
      * q-table
      **/
      filter: '',
      loading: true,
      allColumns: ['schema', 'uri', 'port', 'host', 'timestamp', 'path'],
      visibleColumns: ['schema', 'uri'],
      pagination: {
        rowsPerPage: 10
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
      * q-table
      **/

      /**
      * dataSources
      **/
      store: false,
      pipeline_id: [
        'input.vhosts.periodical',
      ],

      id: 'vhosts',
      path: 'all',

      // components: {
      //   'input.vhosts.periodical': {
      //     range: {
      //       source: {
      //         requests: PeriodicalSources.requests
      //         // store: store
      //       }
      //     }
      //   }
      // }
    }
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.vhosts.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    // info (item, index, button) {
    //   this.infoModal.title = `Row index: ${index}`
    //   this.infoModal.content = JSON.stringify(item, null, 2)
    //   this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    // },
    // resetInfoModal () {
    //   this.infoModal.title = ''
    //   this.infoModal.content = ''
    // },
    // onFiltered (filteredItems) {
    //   // Trigger pagination to update the number of buttons/pages due to filtering
    //   this.totalRows = filteredItems.length
    //   this.currentPage = 1
    // },
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
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options.req_components[pipeline_id], pipeline_id)
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
