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

            <world-map :cities="periodical.world_map_cities"/>

            <bar-race
              :categoryY="'country'"
              :values="periodical.top_country_counter"
              :label="'Per COUNTRY count (last 5 secs)'"
              :id="'top_country_counter'" :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_country_counter'"
            />

            <bar-race
              :categoryY="'country'"
              :values="periodical.top_country_counter"
              :label="'Per COUNTRY count (sum)'"
              :id="'top_country_counter_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_country_counter_sum'"
            />

            <bar-race
              :categoryY="'city'"
              :values="periodical.top_city_counter"
              :label="'Per CITY count (last 5 secs)'"
              :id="'top_city_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_city_counter'"
            />

            <bar-race
              :categoryY="'city'"
              :values="periodical.top_city_counter"
              :label="'Per CITY count (sum)'"
              :id="'top_city_counter_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_city_counter_sum'"
            />

            <!-- <div v-for="(val, prop) in minute" :key="'minute.'+prop">
              minute: {{prop}} - {{val}} <br/>
            </div>
            <hr>

            <div v-for="(val, prop) in hour" :key="'hour.'+prop">
              hour: {{prop}} - {{val}} <br/>
            </div>
            <hr>

            <div v-for="(val, prop) in day" :key="'day.'+prop">
              day: {{prop}} - {{val}} <br/>
            </div>
            <hr> -->

            periodical.total_bytes_sent: {{ periodical.total_bytes_sent }} <br/>
            periodical.hits: {{ periodical.hits }} <br/>

            <hr>

            periodical.current_bytes_sent: {{ periodical.current_bytes_sent }}

            <hr>

            <div v-for="(val, status) in periodical.status_counter" :key="'status.'+status">
              periodical.status_counter: {{status}} - {{val}} <br/>
            </div>

            <hr>

            <!-- <div v-for="(val, city) in periodical.city_counter" :key="'city.'+city">
              periodical.city_counter: {{city}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, country) in periodical.country_counter" :key="'country.'+country">
              periodical.country_counter: {{country}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, continent) in periodical.continent_counter" :key="'continent.'+continent">
              periodical.continent_counter: {{continent}} - {{val}} <br/>
            </div>

            <hr> -->

            <!-- <div v-for="(val, addr) in periodical.addr_counter" :key="'addr.'+addr">
              periodical.addr_counter: {{addr}} - {{val}} <br/>
            </div> -->

            <hr>

            <div v-for="(val, user) in periodical.user_counter" :key="'user.'+user">
              periodical.user_counter: {{user}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, referer) in periodical.referer_counter" :key="'referer.'+referer">
              periodical.referer_counter: {{referer}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, type) in periodical.type_counter" :key="'type.'+type">
              periodical.type_counter: {{type}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, os) in periodical.user_agent_os_counter" :key="'os.'+os">
              periodical.user_agent_os_counter: {{os}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, os) in periodical.user_agent_os_family_counter" :key="'os_family.'+os+'-'+val">
              periodical.user_agent_os_family_counter: {{os}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, engine) in periodical.user_agent_engine_counter" :key="'engine.'+engine+'-'+val">
              periodical.user_agent_engine_counter: {{engine}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, browser) in periodical.user_agent_browser_counter" :key="'browser.'+browser+'-'+val">
              periodical.user_agent_browser_counter: {{browser}} - {{val}} <br/>
            </div>

            <hr>

            <div v-for="(val, device) in periodical.user_agent_device_counter" :key="'device.'+device+'-'+val">
              periodical.user_agent_device_counter: {{device}} - {{val}} <br/>
            </div>

          </q-tab-panel>

          <q-tab-panel name="minute" :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'">
            <!-- <div class="text-h6">From: {{ format_time(minute.range.start) }} - To: {{ format_time(minute.range.end) }} / Updated on: {{ format_time(minute.timestamp) }}</div> -->
            <!-- <world-map :cities="minute.world_map_cities"/> -->
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
              :categoryY="'country'"
              :values="minute.top_country_counter"
              :label="'Minute Per COUNTRY count'"
              :id="'minute.top_country_counter'" :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute.top_country_counter'"
            />

            <!-- <bar-race
              :categoryY="'country'"
              :values="minute.country_counter"
              :label="'Per COUNTRY count (sum)'"
              :id="'country_counter_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.country_counter_sum'"
            /> -->

            <bar-race
              :categoryY="'city'"
              :values="minute.top_city_counter"
              :label="'Minute Per CITY count'"
              :id="'minute.top_city_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute.top_city_counter'"
            />

            <bar-race
              :categoryY="'continent'"
              :values="minute.continent_counter"
              :label="'Minute Per CONTINENT count'"
              :id="'minute.continent_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute.continent_counter'"
            />
          </q-tab-panel>

          <q-tab-panel name="hour" :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'">
            <!-- <div class="text-h6">From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}</div> -->
            <!-- <world-map :cities="hour.world_map_cities"/> -->
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
              :categoryY="'country'"
              :values="hour.top_country_counter"
              :label="'Hour Per COUNTRY count'"
              :id="'hour.top_country_counter'" :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.top_country_counter'"
            />

            <!-- <bar-race
              :categoryY="'country'"
              :values="hour.country_counter"
              :label="'Per COUNTRY count (sum)'"
              :id="'country_counter_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.country_counter_sum'"
            /> -->

            <bar-race
              :categoryY="'city'"
              :values="hour.top_city_counter"
              :label="'Hour Per CITY count'"
              :id="'hour.top_city_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.top_city_counter'"
            />

            <bar-race
              :categoryY="'continent'"
              :values="hour.continent_counter"
              :label="'Hour Per CONTINENT count'"
              :id="'hour.continent_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.continent_counter'"
            />
          </q-tab-panel>

          <q-tab-panel name="day" :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'">
            <!-- <div class="text-h6">From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}</div> -->
            <!-- <world-map :cities="day.world_map_cities"/> -->
            <q-toolbar class="text-primary">
              <!-- <q-btn flat round dense icon="menu" /> -->
              <q-toolbar-title>
                From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}
              </q-toolbar-title>
              <!-- <q-space class="text-primary"/> -->
              <template>
                <div class="q-pa-md">
                  <!-- <q-btn name="calendar_roday" /> -->
                    <!-- round -->
                    <!-- <q-icon name="calendar_today" class="cursor-pointer q-ma-md"/> -->
                    <!-- <q-input flat v-model="date" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" :options="disabled_days" minimal/>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input> -->
                    <q-btn flat dense icon="calendar_today" />
                    <q-popup-proxy v-model="showCalendar" ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <!-- <q-date v-model="selected_day" :options="disabled_days" minimal/> -->
                        <b-calendar v-model="selected_day" @context="onContext" :max="disabled_max_days" locale="en-US"></b-calendar>
                    </q-popup-proxy>

                </div>
              </template>
            </q-toolbar>
            <bar-race
              :categoryY="'country'"
              :values="day.top_country_counter"
              :label="'Day Per COUNTRY count'"
              :id="'day.top_country_counter'" :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.top_country_counter'"
            />

            <!-- <bar-race
              :categoryY="'country'"
              :values="day.country_counter"
              :label="'Per COUNTRY count (sum)'"
              :id="'country_counter_sum'"
              :zoom="apply_zoom"
              :sum="true"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.country_counter_sum'"
            /> -->

            <bar-race
              :categoryY="'city'"
              :values="day.top_city_counter"
              :label="'Day Per CITY count'"
              :id="'day.top_city_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.top_city_counter'"
            />

            <bar-race
              :categoryY="'continent'"
              :values="day.continent_counter"
              :label="'Day Per CONTINENT count'"
              :id="'day.continent_counter'"
              :zoom="apply_zoom"
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.top_continent'"
            />
          </q-tab-panel>
        </q-tab-panels>

        <q-table
          flat
          :table-class="'my-sticky-header-table'"
          title="Web Logs"
          :data="periodical.logs"
          :columns="columns"
          :row-key="(row, index) => row.timestamp + row.domain +'.'+ row.host +'.'+ row.path + '.' + index"
          :pagination.sync="pagination"
          :rows-per-page-options="[0]"
          :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
          :loading="loading_logs"
          :filter="search_filter"
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
      </b-col>
    </b-row>
  </div>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:pages:filter')

import { date } from 'quasar'

// let moment = require('moment')

// import OsPluginDygraph from '@apps/logs/components/pluginDygraph'
import BarRace from '@apps/logs/components/barRace'

import WorldMap from '@apps/logs/web/components/worldMap'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'

import PeriodicalPipeline from '@apps/logs/web/pipelines/filter/periodical'
import MinutePipeline from '@apps/logs/web/pipelines/filter/minute'
import HourPipeline from '@apps/logs/web/pipelines/filter/hour'
import DayPipeline from '@apps/logs/web/pipelines/filter/day'

import * as PeriodicalSources from '@apps/logs/web/sources/filter/periodical/index'
import * as MinuteSources from '@apps/logs/web/sources/filter/minute/index'
import * as HourSources from '@apps/logs/web/sources/filter/hour/index'
import * as DaySources from '@apps/logs/web/sources/filter/day/index'

// import { requests, store } from '@apps/logs/web/sources/filter/index'

// const MAX_FEED_DATA = 10
import moment from 'moment'

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

  components: { WorldMap, BarRace },

  name: 'LogsWebFilter',

  data () {
    return {
      id: 'logs.web.filter',
      path: 'all',

      range_tab: 'minute',

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

      day: {
        top_city_counter: {},
        top_country_counter: {},

        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        city_counter: {},
        country_counter: {},
        continent_counter: {},
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
      hour: {
        top_city_counter: {},
        top_country_counter: {},

        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        city_counter: {},
        country_counter: {},
        continent_counter: {},
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
        top_city_counter: {},
        top_country_counter: {},

        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        city_counter: {},
        country_counter: {},
        continent_counter: {},
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
        range: { start: 0, end: 0},

        top_city_counter: {},
        top_country_counter: {},

        logs: [],

        total_bytes_sent: 0,
        hits: 0,

        current_bytes_sent: 0,

        status_counter: {},

        city_counter: {},
        country_counter: {},
        continent_counter: {},
        world_map_cities: [],

        addr_counter: {},
        user_counter: {},
        referer_counter: {},
        type_counter: {},

        user_agent_os_counter: {},
        user_agent_os_family_counter: {},
        user_agent_engine_counter: {},
        user_agent_browser_counter: {},
        user_agent_device_counter: {}

      },

      store: false,
      // pipeline_id: 'input.logs.web.filter',
      pipeline_id: [
        'input.logs.web.filter.periodical',
        'input.logs.web.filter.minute',
        'input.logs.web.filter.hour',
        'input.logs.web.filter.day'
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

      components: {
        'input.logs.web.filter.periodical': {
          range: {
            source: {
              requests: PeriodicalSources.requests
              // store: store
            }
          }
        },
        'input.logs.web.filter.minute': {
          range: {
            source: {
              requests: MinuteSources.requests
              // store: store
            }
          }
        },
        'input.logs.web.filter.hour': {
          range: {
            source: {
              requests: HourSources.requests
              // store: store
            }
          }
        },
        'input.logs.web.filter.day': {
          range: {
            source: {
              requests: DaySources.requests
              // store: store
            }
          }
        }

      }
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
    }
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
      this.destroy_pipelines('input.logs.web.filter.hour')
      this.create_pipelines('input.logs.web.filter.hour')
      this.resume_pipelines('input.logs.web.filter.hour')
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
      this.destroy_pipelines('input.logs.web.filter.minute')
      this.create_pipelines('input.logs.web.filter.minute')
      this.resume_pipelines('input.logs.web.filter.minute')
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
    // apply_zoom: function (data, categoryY, valueX) {
    //   // const min_zoom = 0.01
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
    //     let zoom = data.length / max_length
    //     // return (zoom > min_zoom) ? zoom : min_zoom
    //     return zoom
    //   }
    // },
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
      //   this.$options.pipelines['input.logs.web.filter.periodical'] &&
      //   this.$options.pipelines['input.logs.web.filter.periodical'].get_input_by_id('input.logs.web.filter.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
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

    /** calendar **/
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

  }

  // computed: {
  //
  // //   count: function () {
  // //     let result = 0
  // //     Array.each(this.groups, function (group) {
  // //       result += group.count
  // //     })
  // //
  // //     return result
  // //   }
  // },
  // mounted: function () {
  //   this.pipeline_id = 'input.logs.web.filter'
  // },
  // create: function () {
  //   debug('created HOST %s %o %o', this.web, this.$options.range_component, this.$options.__pipelines_cfg)
  //   // EventBus.$on(this.pipeline_id, this.__process_input_data)
  //
  //   // if (this.store) this.__register_store_module(this.id, sourceStore)
  //   // this.__bind_components_to_sources(this.components)
  //   // this.create_pipelines()
  //
  //   // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.web = this.web
  //   // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.web = this.web
  //   // this.$set(this.components, 'range', this.$options.range_component)
  //   // this.$set(this.components, 'feed', this.$options.feed_component)
  //   // this.components.range.source.requests.once.push(this.$options.range_component)
  //
  //   this.components.range.source.requests.periodical.push(this.$options.range_component)
  // }

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
