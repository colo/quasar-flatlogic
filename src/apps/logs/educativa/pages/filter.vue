<template>
  <div class="dashboard-page">
    <h1 class="page-title">Logs Web</h1>
    <b-row>
      <b-col xs="12">
        <q-tabs
          v-model="range_tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="periodical" label="Now" />
          <q-tab name="minute" label="Minute" />
          <q-tab name="hour" label="Hourly" />
          <q-tab name="day" label="Daily" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="range_tab">
          <!-- animated -->
          <q-tab-panel name="periodical" :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'">
            <!-- <div class="text-h6">From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}</div> -->
            <q-toolbar class="text-primary">
              <!-- <q-btn flat round dense icon="menu" /> -->
              <q-toolbar-title>
                From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
              </q-toolbar-title>
              <!-- <q-space class="text-primary"/> -->

            </q-toolbar>

            <bar-race
              :categoryY="'cgi'"
              :valueX="'count'"
              :values="periodical.top_cgi_count"
              :label="'Per CGI count (last 5 secs)'"
              :id="'cgi_count'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count'"
            />

            <bar-race
              :categoryY="'cgi'"
              :valueX="'count'"
              :values="periodical.top_cgi_count"
              :label="'Per CGI count (sum)'"
              :id="'cgi_count_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.cgi_count_sum'"
            />
            <!-- :label="format_time(periodical.timestamp)" -->

            <bar-race
              :categoryY="'domain'"
              :valueX="'count'"
              :values="periodical.top_per_domain"
              :label="'Per DOMAIN - CGI count (last 5 secs)'"
              :id="'per_domain_count'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count'"
            />

            <bar-race
              :categoryY="'domain'"
              :valueX="'count'"
              :values="periodical.top_per_domain"
              :label="'Per DOMAIN - CGI count (sum)'"
              :id="'per_domain_count_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_count_sum'"
            />

            <bar-race
              :categoryY="'host'"
              :valueX="'count'"
              :values="periodical.top_per_host"
              :label="'Per HOST - CGI count (last 5 secs)'"
              :id="'per_host_count'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count'"
            />

            <bar-race
              :categoryY="'host'"
              :valueX="'count'"
              :values="periodical.top_per_host"
              :label="'Per HOST - CGI count (sum)'"
              :id="'per_host_count_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_host_count_sum'"
            />

            <bar-race
              :categoryY="'domain'"
              :valueX="'sum'"
              :values="periodical.top_per_domain"
              :label="'Per DOMAIN - total duration (last 5 secs)'"
              :id="'per_domain_total'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.per_domain_total'"
            />

            <!-- <bar-race :categoryY="'host'" :valueX="'sum'" :values="periodical.per_host" :label="'Per HOST - total duration'" :id="'per_host_sum'" :zoom="apply_zoom" :sum="true"/> -->

            <div v-for="(count, cgi) in periodical.cgi_count" :key="'cgi_count.'+cgi">
              periodical.cgi_count: {{cgi}} - {{count}} <br/>
            </div>

            <hr>

            <div v-for="(val, domain) in periodical.per_domain" :key="'per_domain.'+domain">
              periodical.per_domain: {{domain}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, stat) in periodical.duration_stats" :key="'duration_stats.'+stat">
              periodical.duration_stats: {{stat}} - {{val}} <br/>
            </div>

            <hr>

          </q-tab-panel>

          <q-tab-panel name="minute" :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'">
            <!-- <div class="text-h6">From: {{ format_time(minute.range.start) }} - To: {{ format_time(minute.range.end) }} / Updated on: {{ format_time(minute.timestamp) }}</div> -->
            <q-toolbar class="text-primary">
              <!-- <q-btn flat round dense icon="menu" /> -->
              <q-toolbar-title>
                From: {{ format_time(minute.range.start) }} - To: {{ format_time(minute.range.end) }} / Updated on: {{ format_time(minute.timestamp) }}
              </q-toolbar-title>
              <!-- <q-space class="text-primary"/> -->
              <template>
                <div class="q-pa-md">

                  <q-btn flat dense icon="access_time" />
                  <q-popup-proxy v-model="showMinute" ref="qMinuteProxy" transition-show="scale" transition-hide="scale">
                      <!-- <q-time
                        v-model="selected_minute"
                        :options="disabled_minutes"
                        now-btn
                      /> -->
                      <b-time v-model="selected_minute" locale="en" @context="onContext"></b-time>
                  </q-popup-proxy>

                </div>
              </template>
            </q-toolbar>
            <bar-race
              :categoryY="'domain'"
              :valueX="'hits'"
              :values="minute.top_per_domain"
              :label="'Minute Per DOMAIN - CGI count'"
              :id="'minute_per_domain_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute_per_domain_sum'"
              />
              <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute_per_domain_sum'" -->
            <!-- :zoom="apply_zoom" -->

            <bar-race
              :categoryY="'host'"
              :valueX="'hits'"
              :values="minute.top_per_host"
              :label="'Minute Per HOST - CGI count'"
              :id="'minute_per_host_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute_per_host_sum'"
            />
            <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute_per_host_sum'" -->
            <!-- :zoom="apply_zoom" -->

          </q-tab-panel>

          <q-tab-panel name="hour" :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'">
            <!-- <div class="text-h6">From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}</div> -->
            <q-toolbar class="text-primary">
              <!-- <q-btn flat round dense icon="menu" /> -->
              <q-toolbar-title>
                From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}
              </q-toolbar-title>
              <!-- <q-space class="text-primary"/> -->
              <template>
                <div class="q-pa-md">

                  <q-btn flat dense icon="access_time" />
                  <q-popup-proxy v-model="showHour" ref="qHourProxy" transition-show="scale" transition-hide="scale">
                      <!-- <q-time
                        v-model="selected_hour"
                        :options="disabled_hours"
                        now-btn
                      /> -->
                      <b-time v-model="selected_hour" :minutes-step="60" locale="en" @context="onContext"></b-time>
                  </q-popup-proxy>

                </div>
              </template>
            </q-toolbar>
            <bar-race
              :categoryY="'domain'"
              :valueX="'hits'"
              :values="hour.top_per_domain"
              :label="'Hour Per DOMAIN - CGI count'"
              :id="'hour_per_domain_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_domain_sum'"
              />
            <!-- :zoom="apply_zoom" -->

            <bar-race
              :categoryY="'host'"
              :valueX="'hits'"
              :values="hour.top_per_host"
              :label="'Hour Per HOST - CGI count'"
              :id="'hour_per_host_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_host_sum'"
              />
            <!-- :zoom="apply_zoom" -->
          </q-tab-panel>

          <q-tab-panel name="day" :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'">
            <q-toolbar class="text-primary">
            <!-- <q-btn flat round dense icon="menu" /> -->
            <q-toolbar-title>
              From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}
            </q-toolbar-title>
            <!-- <q-space class="text-primary"/> -->
            <template>
              <div class="q-pa-md">
                  <q-btn flat dense icon="calendar_today" />
                  <q-popup-proxy v-model="showCalendar" ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <!-- <q-date v-model="selected_day" :options="disabled_days" minimal/> -->
                      <b-calendar v-model="selected_day" @context="onContext" :max="disabled_max_days" locale="en-US"></b-calendar>
                  </q-popup-proxy>

              </div>
            </template>
          </q-toolbar>

            <!-- <div class="text-h6">From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}</div> -->
            <bar-race
              :categoryY="'domain'"
              :valueX="'hits'"
              :values="day.top_per_domain"
              :label="'Day Per DOMAIN - CGI count'"
              :id="'day_per_domain_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_domain_sum'"
              />
            <!-- :zoom="apply_zoom" -->

            <bar-race
              :categoryY="'host'"
              :valueX="'hits'"
              :values="day.top_per_host"
              :label="'Day Per HOST - CGI count'"
              :id="'day_per_host_sum'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_host_sum'"
              />
            <!-- :zoom="apply_zoom" -->
          </q-tab-panel>
        </q-tab-panels>

        <q-table
          flat
          :table-class="'my-sticky-header-table'"
          title="Educativa Logs"
          :data="periodical.logs"
          :columns="columns"
          :row-key="(row, index) => row.timestamp + row.domain +'.'+ row.host +'.'+ row.path + '.' + index"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
          :loading="loading_logs"
          :filter="search_filter"
          :key="$route.path +'.'+ JSON.stringify($route.query)+'.table'"
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

            <q-input borderless dense debounce="100" v-model="search_filter" placeholder="Search">
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

            <q-td key="date" :props="props">
              {{ format_time(props.row.timestamp) }}
            </q-td>

            <q-td key="log" :props="props">
              {{ format_log(props.row.log) }}
            </q-td>

            <q-td key="domain" :props="props">
              <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
              <b-button
                variant="outline"
                @click="destroy_pipelines()"
                :to="'/logs/educativa/filter/?domain=' + props.row.domain"
              >
                {{ props.row.domain }}
                <q-icon name="open_in_browser" />
              </b-button>
              <!-- <q-btn
                v-on:click="destroy_pipelines()"
                :to="'/logs/educativa/filter/?domain=' + props.row.domain"
                flat
                icon="open_in_browser"
                :label="props.row.domain"
              /> -->
            </q-td>

            <q-td key="host" :props="props">
              <b-button
                variant="outline"
                @click="destroy_pipelines()"
                :to="'/logs/educativa/filter/?host=' + props.row.host"
              >
                {{ props.row.host }}
                <q-icon name="open_in_browser" />
              </b-button>
              <!-- <q-btn
                v-on:click="destroy_pipelines()"
                :to="'/logs/educativa/filter/?host=' + props.row.host"
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
                :to="'/logs/educativa/filter/?path=' + props.row.path"
              >
                {{ props.row.path }}
                <q-icon name="open_in_browser" />
              </b-button>
              <!-- <q-btn
                v-on:click="destroy_pipelines()"
                :to="'/logs/educativa/filter/?path=' + props.row.path"
                flat
                icon="open_in_browser"
                :label="props.row.path"
              /> -->
            </q-td>
          </q-tr>
          </template>
        </q-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:pages:filter')

import { date } from 'quasar'

import BarRace from '@apps/logs/components/barRace'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'

import PeriodicalPipeline from '@apps/logs/educativa/pipelines/filter/periodical'
import MinutePipeline from '@apps/logs/educativa/pipelines/filter/minute'
import HourPipeline from '@apps/logs/educativa/pipelines/filter/hour'
import DayPipeline from '@apps/logs/educativa/pipelines/filter/day'

import * as PeriodicalSources from '@apps/logs/educativa/sources/filter/periodical/index'
import * as MinuteSources from '@apps/logs/educativa/sources/filter/minute/index'
import * as HourSources from '@apps/logs/educativa/sources/filter/hour/index'
import * as DaySources from '@apps/logs/educativa/sources/filter/day/index'

// const MAX_FEED_DATA = 10
import moment from 'moment'

// import QCalendar from '@quasar/quasar-ui-qcalendar'

// function leftClick (e) {
//   return e.button === 0
// }

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const roundSeconds = function (timestamp) {
  timestamp = roundMilliseconds(timestamp)
  let d = new Date(timestamp)
  d.setSeconds(0)

  return d.getTime()
}

const roundMinutes = function (timestamp) {
  timestamp = roundSeconds(timestamp)
  let d = new Date(timestamp)
  d.setMinutes(0)

  return d.getTime()
}
const roundHours = function (timestamp) {
  timestamp = roundMinutes(timestamp)
  let d = new Date(timestamp)
  d.setHours(0)

  return d.getTime()
}
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

export default {
  mixins: [DataSourcesMixin],

  components: { BarRace },

  name: 'LogsEducativaFilter',

  req_components: {
    'input.logs.educativa.filter.periodical': {
      range: {
        source: {
          requests: PeriodicalSources.requests
          // store: store
        }
      }
    },
    'input.logs.educativa.filter.minute': {
      range: {
        source: {
          requests: MinuteSources.requests
          // store: store
        }
      }
    },
    'input.logs.educativa.filter.hour': {
      range: {
        source: {
          requests: HourSources.requests
          // store: store
        }
      }
    },
    'input.logs.educativa.filter.day': {
      range: {
        source: {
          requests: DaySources.requests
          // store: store
        }
      }
    }

  },

  data () {
    return {
      id: 'logs.educativa.filter',
      path: 'all',

      range_tab: 'minute',

      // end: Date.now(),
      current_day: undefined,
      current_hour: undefined,
      current_minute: undefined,
      top: 15,

      /** calendar **/
      selected_day: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      selected_hour: date.formatDate(Date.now(), 'HH') + ':00',
      selected_minute: date.formatDate(Date.now(), 'HH:mm'),
      // selectedDate: '',
      // convertedDates: '',
      showCalendar: false,
      showHour: false,
      showMinute: false,
      // anchorTimestamp: '',
      // otherTimestamp: '',
      // mouseDown: false,
      // mobile: false,
      /** calendar **/

      day: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
      },
      hour: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        // body_bytes_sent: {},
        // geoip: {},
        // qs: {},
        // referer: {},
        // pathname: {},
        // method: {},
        // remote_addr: {},
        // remote_user: {},
        // status: {},
        // unique_visitors: 0,
        // unique_visitors_by_ip: {},
        // user_agent: {},
        //
        // type_counter: {}
      },
      minute: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        // body_bytes_sent: {},
        // geoip: {},
        // qs: {},
        // referer: {},
        // pathname: {},
        // method: {},
        // remote_addr: {},
        // remote_user: {},
        // status: {},
        // unique_visitors: 0,
        // unique_visitors_by_ip: {},
        // user_agent: {},
        //
        // type_counter: {}
      },

      periodical: {
        top_per_domain: {},
        top_per_host: {},
        top_cgi_count: {},
        // date: undefined,
        // timestamp: 0,
        logs: [],

        cgi_count: {},
        // domain_count: {},
        per_domain: {},

        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,

        // total_bytes_sent: 0,
        // hits: 0,
        //
        // current_bytes_sent: 0,
        //
        // status_counter: {},
        //
        // city_counter: {},
        // country_counter: {},
        // continent_counter: {},
        // world_map_cities: [],
        //
        // addr_counter: {},
        // user_counter: {},
        // referer_counter: {},
        // type_counter: {},
        //
        // user_agent_os_counter: {},
        // user_agent_os_family_counter: {},
        // user_agent_engine_counter: {},
        // user_agent_browser_counter: {},
        // user_agent_device_counter: {}

      },

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.periodical',
        'input.logs.educativa.filter.minute',
        'input.logs.educativa.filter.hour',
        'input.logs.educativa.filter.day'
      ],

      // logs: [],

      search_filter: '',
      loading_logs: true,
      allColumns: ['date', 'log', 'domain', 'host', 'path'],
      visibleColumns: ['log'],
      pagination: {
        rowsPerPage: 10
      },

      columns: [
        // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'timestamp',
          sortable: true
        },
        {
          name: 'log',
          required: true,
          label: 'Log',
          align: 'left',
          field: 'log',
          sortable: true
        },
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

      // components: {
      //   'input.logs.educativa.filter.periodical': {
      //     range: {
      //       source: {
      //         requests: PeriodicalSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.educativa.filter.minute': {
      //     range: {
      //       source: {
      //         requests: MinuteSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.educativa.filter.hour': {
      //     range: {
      //       source: {
      //         requests: HourSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.educativa.filter.day': {
      //     range: {
      //       source: {
      //         requests: DaySources.requests
      //         // store: store
      //       }
      //     }
      //   }
      //
      // }
    }
  },

  computed: {
    disabled_max_days: function () {
      // return date <= moment().format('YYYY/MM/DD')
      return moment().format('YYYY-MM-DD')// boostrap
    },
    pagesNumber () {
      return Math.ceil(this.periodical.logs.length / this.pagination.rowsPerPage)
    },
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      return (this.$route && this.$route.query)
        ? this.$route.query
        : undefined
    },
    'type': function () {
      return (this.filter) ? Object.keys(this.filter)[0] : undefined
    },
    'web': function () {
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    },
    /** calendar **/
    // startEndDates () {
    //   const dates = []
    //   if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
    //     if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
    //       dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
    //     } else {
    //       dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
    //     }
    //   }
    //   return dates
    // },
    //
    // anchorDayIdentifier () {
    //   if (this.anchorTimestamp !== '') {
    //     return QCalendar.getDayIdentifier(this.anchorTimestamp)
    //   }
    //   return false
    // },
    //
    // otherDayIdentifier () {
    //   if (this.otherTimestamp !== '') {
    //     return QCalendar.getDayIdentifier(this.otherTimestamp)
    //   }
    //   return false
    // },
    //
    // lowIdentifier () {
    //   // returns lowest of the two values
    //   return Math.min(this.anchorDayIdentifier, this.otherDayIdentifier)
    // },
    //
    // highIdentifier () {
    //   // returns highest of the two values
    //   return Math.max(this.anchorDayIdentifier, this.otherDayIdentifier)
    // }
  },
  // computed: {
  //   'web': function () {
  //     return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
  //   },
  //   'type': function () {
  //     return (this.$route && this.$route.params && this.$route.params.type) ? this.$route.params.type : undefined
  //   }
  // },
  watch: {
    /** calendar **/
    // startEndDates () {
    //   const [start, end] = this.startEndDates
    //   this.current_day = (moment(end).unix() * 1000) + DAY
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines()
    //   this.create_pipelines()
    //   this.resume_pipelines()
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   debug('startEndDates', this.end)
    // },
    selected_day () {
      debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
      if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
        this.current_day = undefined
      } else {
        this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.day')
      this.create_pipelines('input.logs.educativa.filter.day')
      this.resume_pipelines('input.logs.educativa.filter.day')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },
    selected_hour () {
      debug('selected_hour %s', new Date(moment(this.selected_hour, 'hh:mm').unix() * 1000))
      if (roundMinutes(moment(this.selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
        this.current_hour = undefined
      } else {
        this.current_hour = (moment(this.selected_hour, 'hh:mm').unix() * 1000) + HOUR
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.hour')
      this.create_pipelines('input.logs.educativa.filter.hour')
      this.resume_pipelines('input.logs.educativa.filter.hour')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },
    selected_minute () {
      debug('selected_minute %s', new Date(moment(this.selected_minute, 'hh:mm').unix() * 1000))
      if (roundSeconds(moment(this.selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
        this.current_minute = undefined
      } else {
        this.current_minute = (moment(this.selected_minute, 'hh:mm').unix() * 1000) + MINUTE
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.minute')
      this.create_pipelines('input.logs.educativa.filter.minute')
      this.resume_pipelines('input.logs.educativa.filter.minute')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    }
    /** calendar **/

  },
  methods: {
    onContext (ctx) {
      this.context = ctx
    },
    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
    },
    end_minute: function () {
      if (this.current_minute === undefined) {
        return Date.now()
      } else {
        return this.current_minute
      }
    },
    end_hour: function () {
      if (this.current_hour === undefined) {
        return Date.now()
      } else {
        return this.current_hour
      }
    },
    end_day: function () {
      if (this.current_day === undefined) {
        return Date.now()
      } else {
        return this.current_day
      }
    },
    // apply_zoom: function (data, categoryY, valueX) {
    //   const min_zoom = 0.3
    //   const max_zoom = 1
    //   /* const min_length = 8 */
    //   const max_length = 15
    //   let length = data.length
    //   /* let zoom = 1 */
    //
    //   if (data.length <= max_length) {
    //     return max_zoom
    //   } else {
    //     // let itemsWithNonZero = 0
    //     // for (let i = 0; i < max_length; i++) {
    //     //   if (data[i][valueX] > 0) {
    //     //     itemsWithNonZero++
    //     //   }
    //     // }
    //
    //     // let zoom = max_length / data.length
    //     // return (zoom > min_zoom) ? zoom : min_zoom
    //     return max_length / data.length
    //   }
    // },
    apply_zoom: function (data, categoryY, valueX) {
      const min_zoom = 0.5
      const max_zoom = 1
      /* const min_length = 8 */
      const max_length = 15
      let length = data.length
      /* let zoom = 1 */

      if (data.length <= max_length) {
        return max_zoom
      } else {
        // let itemsWithNonZero = 0
        // for (let i = 0; i < max_length; i++) {
        //   if (data[i][valueX] > 0) {
        //     itemsWithNonZero++
        //   }
        // }

        // let zoom = max_length / data.length
        // return (zoom > min_zoom) ? zoom : min_zoom
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'] &&
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'].get_input_by_id('input.logs.educativa.filter.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [PeriodicalPipeline, MinutePipeline, HourPipeline, DayPipeline]
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

    /** calendar **/
    // disabled_hours: function (date) {
    //   return date <= moment().format('HH')
    //   // && date <= '2019/02/15'
    // },
    disabled_minutes (hr, min, sec) {
      debug('disabled_minutes ', hr, min, sec)
      if (hr) {
        if (min !== null) {
          return min <= moment().format('mm')
        }
        return false
      }

      // if (sec !== null && sec % 10 !== 0) {
      //   return false
      // }
      return true
    },
    disabled_hours (hr, min, sec) {
      debug('disabled_hours ', hr, min, sec)
      if (hr) {
        if (min) {
          return false
        }
        return hr <= moment().format('HH')
      }

      // if (sec !== null && sec % 10 !== 0) {
      //   return false
      // }
      return true
    },
    disabled_days: function (date) {
      return date <= moment().format('YYYY/MM/DD')
      // && date <= '2019/02/15'
    },

    // disabled_after: function () {
    //   return moment().add(1, 'd').format('YYYY-MM-DD')
    // },
    // onInputChanged (val) {
    //   const items = val.split(' - ')
    //   if (items[0] && items[0].length === 10) this.anchorTimestamp = QCalendar.parseTimestamp(items[0])
    //   if (items[1] && items[1].length === 10) this.otherTimestamp = QCalendar.parseTimestamp(items[1])
    // },
    //
    // calendarNext () {
    //   this.$refs.calendar.next()
    // },
    //
    // calendarPrev () {
    //   this.$refs.calendar.prev()
    // },
    //
    // classDay (timestamp) {
    //   if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
    //     return this.getBetween(timestamp)
    //   }
    // },
    //
    // getBetween (timestamp) {
    //   const nowIdentifier = QCalendar.getDayIdentifier(timestamp)
    //   return {
    //     'q-selected-day-first': this.lowIdentifier === nowIdentifier,
    //     'q-selected-day': this.lowIdentifier <= nowIdentifier && this.highIdentifier >= nowIdentifier,
    //     'q-selected-day-last': this.highIdentifier === nowIdentifier
    //   }
    // },
    //
    // onMouseDownDay ({ scope, event }) {
    //   if (leftClick(event)) {
    //     if (this.mobile === true &&
    //       this.anchorTimestamp !== null &&
    //       this.otherTimestamp !== null &&
    //       this.anchorTimestamp.date === this.otherTimestamp.date) {
    //       this.otherTimestamp = scope
    //       this.mouseDown = false
    //       return
    //     }
    //     // mouse is down, start selection and capture current
    //     this.mouseDown = true
    //     this.anchorTimestamp = scope
    //     this.otherTimestamp = scope
    //   }
    // },
    //
    // onMouseUpDay ({ scope, event }) {
    //   if (leftClick(event)) {
    //     // mouse is up, capture last and cancel selection
    //     this.otherTimestamp = scope
    //     this.mouseDown = false
    //   }
    // },
    //
    // onMouseMoveDay ({ scope, event }) {
    //   if (this.mouseDown === true) {
    //     this.otherTimestamp = scope
    //   }
    // }
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
