<template>

  <div class="q-pa-md">
    <b-card no-body>
      <b-tabs pills card lazy>
        <b-tab title="Now" no-body active>
          <q-toolbar class="text-primary">
            <!-- <q-btn flat round dense icon="menu" /> -->
            <q-toolbar-title>
              From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
            </q-toolbar-title>
            <!-- <q-space class="text-primary"/> -->

          </q-toolbar>
          <template v-for="(category) in periodical.plugins_categories">
            <!-- {{category}} -->
            <!-- <q-card :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.'+category"> -->
            <Widget
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.'+category"
            >
              <a :id="category"/>
              <!-- <q-card-section> -->
                <div class="text-h3">{{category}}</div>
              <!-- </q-card-section> -->

              <!-- <q-card-section> -->
                <template v-for="(name) in periodical.plugins">
                  <!-- {{name}} -->
                  <system-plugin-dygraph
                    v-if="name.indexOf(category) > -1"
                    :ref="name+'.periodical'"
                    :id="'os.'+name+'.periodical'"
                    :name="name"
                    :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'+name+'.plugin'"
                  />
                  <!-- :interval="1" -->
                </template>
              <!-- </q-card-section> -->
            </Widget>
            <!-- </q-card> -->
          </template>
        </b-tab>
        <b-tab title="Minute" no-body>
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
                    <q-time
                      v-model="selected_minute"
                      :options="disabled_minutes"
                      now-btn
                      />
                </q-popup-proxy>

              </div>
            </template>
          </q-toolbar>
          <template v-for="(category) in minute.plugins_categories">
            <!-- {{category}} -->
            <q-card :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute.'+category">
              <a :id="category"/>
              <q-card-section>
                <div class="text-h3">{{category}}</div>
              </q-card-section>

              <q-card-section>
                <template v-for="(name) in minute.plugins">
                  <!-- {{name}} -->
                  <system-plugin-dygraph
                    v-if="name.indexOf(category) > -1"
                    :ref="name+'.minute'"
                    :id="'os.'+name+'.minute'"
                    :name="name"
                    :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute.'+name+'.plugin'"
                    :stat="{
                      data: [],
                      length: $options.minute.length,
                      range: undefined,
                    }"
                    :dygraph="$options.minute.dygraph"
                    :interval="$options.minute.interval"
                  />
                </template>
              </q-card-section>

              <!-- <q-separator dark /> -->
            </q-card>
          </template>
        </b-tab>
        <b-tab title="Hourly" no-body>
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
                    <q-time
                      v-model="selected_hour"
                      :options="disabled_hours"
                      now-btn
                      />
                </q-popup-proxy>

              </div>
            </template>
          </q-toolbar>
          <template v-for="(category) in hour.plugins_categories">
            <!-- {{category}} -->
            <Widget
              :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.'+category"
            >
            <!-- <q-card :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.'+category"> -->
              <a :id="category"/>
              <!-- <q-card-section> -->
                <div class="text-h3">{{category}}</div>
              <!-- </q-card-section> -->

              <!-- <q-card-section> -->
                <template v-for="(name) in hour.plugins">
                  <!-- {{name}} -->
                  <system-plugin-dygraph
                    v-if="name.indexOf(category) > -1"
                    :ref="name+'.hour'"
                    :id="'os.'+name+'.hour'"
                    :name="name"
                    :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour.'+name+'.plugin'"
                    :stat="{
                      data: [],
                      length: $options.hour.length,
                      range: undefined,
                    }"
                    :dygraph="$options.hour.dygraph"
                    :interval="$options.hour.interval"
                  />
                </template>
              <!-- </q-card-section> -->

              <!-- <q-separator dark /> -->
            <!-- </q-card> -->
            </Widget>
          </template>
        </b-tab>
        <b-tab title="Daily" no-body>
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
                  <q-date v-model="selected_day" :options="disabled_days" minimal/>
              </q-popup-proxy>

            </div>
          </template>
        </q-toolbar>
        <template v-for="(category) in day.plugins_categories">
          <!-- {{category}} -->
          <Widget
            :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.'+category"
          >
          <!-- <q-card :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.'+category"> -->
            <a :id="category" />
            <!-- <q-card-section> -->
              <div class="text-h3">{{category}}</div>
            <!-- </q-card-section> -->

            <!-- <q-card-section> -->
              <template v-for="(name) in day.plugins">
                <!-- {{name}} -->
                <system-plugin-dygraph
                  v-if="name.indexOf(category) > -1"
                  :ref="name+'.day'"
                  :id="'os.'+name+'.day'"
                  :name="name"
                  :key="$route.path +'.'+ JSON.stringify($route.query)+'.day.'+name+'.plugin'"
                  :stat="{
                    data: [],
                    length: $options.day.length,
                    range: undefined,
                  }"
                  :dygraph="$options.day.dygraph"
                  :interval="$options.day.interval"
                />
              </template>
            <!-- </q-card-section> -->

            <!-- <q-separator dark /> -->
          <!-- </q-card> -->
          </Widget>
        </template>
        </b-tab>
      </b-tabs>
    </b-card>
    <!-- <q-tabs
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
      <q-tab-panel name="periodical" :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'">
      </q-tab-panel>

      <q-tab-panel name="minute" :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'">
      </q-tab-panel>

      <q-tab-panel name="hour" :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'">
      </q-tab-panel>

      <q-tab-panel name="day" :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'">

      </q-tab-panel>
    </q-tab-panels> -->

  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:system:pages:host')

import { date } from 'quasar'

import SystemPluginDygraph from '@apps/system/components/pluginDygraph'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/system/pipelines/host'

// import { requests, store } from '../sources/host/periodical/index'
import PeriodicalPipeline from '@apps/system/pipelines/host/periodical'
import MinutePipeline from '@apps/system/pipelines/host/minute'
import HourPipeline from '@apps/system/pipelines/host/hour'
import DayPipeline from '@apps/system/pipelines/host/day'

import * as PeriodicalSources from '@apps/system/sources/host/periodical/index'
import * as MinuteSources from '@apps/system/sources/host/minute/index'
import * as HourSources from '@apps/system/sources/host/hour/index'
import * as DaySources from '@apps/system/sources/host/day/index'

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

  components: { SystemPluginDygraph },

  name: 'SystemHost',

  periodical: {
    plugins_data: {},
    length: 360,
    interval: 60
  },

  minute: {
    dygraph: {
      skip: 300, // seconds (5 mins)
      interval: 1,
      'options': {
        axes: {
          x: {
            pixelsPerLabel: 50,
            // ticker: Dygraph.dateTicker,
            axisLabelFormatter: function (d, gran) {
              // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
              return d.getDate() + ' - ' + d.getHours() + ':' + d.getMinutes()
            },
            valueFormatter: function (ms) {
              var d = new Date(ms)
              return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
            }
          },
          y: {
            pixelsPerLabel: 15,
            valueFormatter: function (x) {
              // we format legends with the state object
              // no need to do anything here
              // return (Math.round(x*100) / 100).toLocaleString();
              // return state.legendFormatValue(x);
              return x
            }
          }
        },
      }
    },
    plugins_data: {},
    length: 43200,
    interval: 60
  },

  hour: {
    dygraph: {
      skip: 7200, // seconds (1 hour)
      interval: 1,
      'options': {
        axes: {
          x: {
            pixelsPerLabel: 50,
            // ticker: Dygraph.dateTicker,
            axisLabelFormatter: function (d, gran) {
              // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
              return d.getDate() + '/' + (d.getMonth() + 1) + ' - ' + d.getHours()
            },
            valueFormatter: function (ms) {
              var d = new Date(ms)
              return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
            }
          },
          y: {
            pixelsPerLabel: 15,
            valueFormatter: function (x) {
              // we format legends with the state object
              // no need to do anything here
              // return (Math.round(x*100) / 100).toLocaleString();
              // return state.legendFormatValue(x);
              return x
            }
          }
        },
      }
    },
    plugins_data: {},
    length: 604800,
    interval: 60
  },

  day: {
    dygraph: {
      interval: 1,
      'options': {
        axes: {
          x: {
            pixelsPerLabel: 50,
            // ticker: Dygraph.dateTicker,
            axisLabelFormatter: function (d, gran) {
              // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
              return d.getDate() + '/' + (d.getMonth() + 1) + ' - ' + d.getHours()
            },
            valueFormatter: function (ms) {
              var d = new Date(ms)
              return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
            }
          },
          y: {
            pixelsPerLabel: 15,
            valueFormatter: function (x) {
              // we format legends with the state object
              // no need to do anything here
              // return (Math.round(x*100) / 100).toLocaleString();
              // return state.legendFormatValue(x);
              return x
            }
          }
        },
      }
    },
    plugins_data: {},
    length: 2678400,
    interval: 3600
  },

  req_components: {
    'input.system.host.periodical': {
      range: {
        source: {
          requests: PeriodicalSources.requests
          // store: store
        }
      }
    },
    'input.system.host.minute': {
      range: {
        source: {
          requests: MinuteSources.requests
          // store: store
        }
      }
    },
    'input.system.host.hour': {
      range: {
        source: {
          requests: HourSources.requests
          // store: store
        }
      }
    },
    'input.system.host.day': {
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
      id: 'system.host',
      path: 'all',

      day: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },
      hour: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },
      minute: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },

      periodical: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },

      store: false,
      // pipeline_id: 'input.system.host',
      pipeline_id: [
        'input.system.host.periodical',
        'input.system.host.minute',
        'input.system.host.hour',
        'input.system.host.day'
      ],

      range_tab: 'periodical',

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

      // components: {
      //   'input.system.host.periodical': {
      //     range: {
      //       source: {
      //         requests: PeriodicalSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.system.host.minute': {
      //     range: {
      //       source: {
      //         requests: MinuteSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.system.host.hour': {
      //     range: {
      //       source: {
      //         requests: HourSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.system.host.day': {
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

  watch: {
    selected_day () {
      debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
      if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
        this.current_day = undefined
      } else {
        this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.system.host.day')
      this.create_pipelines('input.system.host.day')
      this.resume_pipelines('input.system.host.day')
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
      this.destroy_pipelines('input.system.host.hour')
      this.create_pipelines('input.system.host.hour')
      this.resume_pipelines('input.system.host.hour')
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
      this.destroy_pipelines('input.system.host.minute')
      this.create_pipelines('input.system.host.minute')
      this.resume_pipelines('input.system.host.minute')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    }
    /** calendar **/
  },
  methods: {
    set_plugin_data: function (plugin, data, type, refresh) {
      if (type === 'minute') { debug('set_plugin_data %s %o %s', plugin, data, type) }

      // Object.each(data, function (value, plugin) {
      if (this.$refs[plugin + '.' + type] && this.$refs[plugin + '.' + type][0] && !this.$refs[plugin + '.' + type][0].$options.plugin_data['system.' + plugin + '.' + type]) {
        this.$refs[plugin + '.' + type][0].$options.plugin_data['system.' + plugin + '.' + type] = { periodical: undefined, minute: undefined }
      }

      if (!this.$options[type].plugins_data[this.host]) {
        this.$options[type].plugins_data[this.host] = {}
      }

      if (!this.$options[type].plugins_data[this.host][plugin]) {
        this.$options[type].plugins_data[this.host][plugin] = { periodical: Object.clone(data) }
      } else if (refresh !== true) {
        // this.$options[type].plugins_data[this.host][plugin].push(Object.clone(value))
        Object.each(data, function (val, prop) {
          // this.$options[type].plugins_data[this.host][plugin].periodical[prop].append(val)
          let val_not_found = []
          Array.each(this.$options[type].plugins_data[this.host][plugin].periodical[prop], function (row) {
            // debug('periodical.plugins_data %d', row[0], val[0][0])

            Array.each(val, function (val_row, val_row_index) {
              if (row[0] !== val_row[0] && !val_not_found.contains(val_row_index)) { // timestamp exist
                val_not_found.push(val_row_index)
              } else if (row[0] === val_row[0] && val_not_found.contains(val_row_index)) {
                val_not_found = val_not_found.erase(val_row_index)
              }
            })
          })

          // debug('periodical.plugins_data to add %o', val_not_found)
          Array.each(val_not_found, function (index) {
            this.$options[type].plugins_data[this.host][plugin].periodical[prop].push(val[index])
          }.bind(this))
          // if (found === false) {
          //   this.$options[type].plugins_data[this.host][plugin].periodical[prop].push(val)
          // }
          // this.$options[type].plugins_data[this.host][plugin].periodical[prop].sort(function (b, a) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
          // this.$options[type].plugins_data[this.host][plugin].periodical[prop] = this.$options[type].plugins_data[this.host][plugin].periodical[prop].slice(0, this.$options[type].length)
          // this.$options[type].plugins_data[this.host][plugin].periodical[prop].sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
        }.bind(this))
      }

      if (this.$refs[plugin + '.' + type] && this.$refs[plugin + '.' + type][0]) {
        if (type === 'minute') {
          debug('set_plugin_data TO PLUGIN %s %o %s', plugin, this.$options[type].plugins_data[this.host][plugin].periodical, type)
        }
        // this.$options[type].plugins_data[this.host][plugin] = this.$options[type].plugins_data[this.host][plugin].slice(0, 360)
        //
        // if (this.$options[type].plugins_data[this.host][plugin] && this.$options[type].plugins_data[this.host][plugin].length > 0) {
        //   debug('periodical.plugins_data from BUFFER %o', this.$options[type].plugins_data[this.host][plugin])
        //   Array.each(this.$options[type].plugins_data[this.host][plugin], function (value) {
        //     this.$refs[plugin + '.' + type][0].set_data(Object.clone(value))
        //   }.bind(this))
        //
        //   // this.$options[type].plugins_data[this.host][plugin] = []
        // }
        // this.$refs[plugin + '.' + type][0].set_data(this.$options[type].plugins_data[this.host][plugin])

        let count = 0
        Object.each(data, function (val, prop) {
          this.$options[type].plugins_data[this.host][plugin].periodical[prop].sort(function (b, a) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
          this.$options[type].plugins_data[this.host][plugin].periodical[prop] = this.$options[type].plugins_data[this.host][plugin].periodical[prop].slice(0, this.$options[type].length)
          this.$options[type].plugins_data[this.host][plugin].periodical[prop].sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })

          if (count === Object.getLength(data) - 1) {
            this.$refs[plugin + '.' + type][0].set_data(Object.clone(this.$options[type].plugins_data[this.host][plugin]))
          }

          count++
        }.bind(this))
      } else { // buffer data until plugin available
        //   debug('periodical.plugins_data BUFFER %o', data)
        setTimeout(function () {
          if (this.$options[type].plugins_data[this.host] && this.$options[type].plugins_data[this.host][plugin]) {
            this.set_plugin_data(plugin, Object.clone(this.$options[type].plugins_data[this.host][plugin].periodical), type, true)
          }
        }.bind(this), 1000)
      }
      // }.bind(this))
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.o.periodicals.host.periodical'] data&
      //   this.$options.pipelines['input.system.host.periodical'].get_input_by_id('input.system.host.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.system.host'].get_input_by_id('input.system').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.system.host'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.system.host'].get_input_by_id('input.system').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [PeriodicalPipeline, MinutePipeline, HourPipeline, DayPipeline] //,
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
    destroy: function () {
      this.$options['periodical'].plugins_data = {}
      this.$options['minute'].plugins_data = {}
      this.$options['hour'].plugins_data = {}
      this.$options['day'].plugins_data = {}
    },

    /**
    * @end pipelines
    **/
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
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
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
  },
  computed: {
    // 'periodical_plugins_data': function () {
    //   return this.periodical.plugins_data
    // },
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  },
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
  //   debug('life cyle mounted')
  // },
  // created: function () {
  //   debug('life cyle create', this.host)
  //
  // },
  // destroyed: function () {
  //   debug('life cyle destroyed')
  // }

}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: baseline;
    -moz-align-items: baseline;
    -webkit-align-items: baseline;
    justify-content: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: White;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #DDDDDD;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: White;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #DDDDDD;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: White;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #CDCDCD;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #F8F8F8;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 10px;
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: white;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: White;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-dygraph-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #666;
    font-weight: normal;
    text-shadow: #BBB 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #999999;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #999999;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 1;
    text-shadow: #777 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #999999;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #999999;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #999999;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #999999;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}

/* ----------------------------------------------------------------------------
   perfect-scrollbar settings
 */

.ps-container {
    -ms-touch-action: auto;
    touch-action: auto;
    overflow: hidden !important;
    -ms-overflow-style: none;
}

@supports (-ms-overflow-style: none) {
    .ps-container {
        overflow: auto !important;
    }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .ps-container {
        overflow: auto !important;
    }
}

.ps-container.ps-active-x > .ps-scrollbar-x-rail,
.ps-container.ps-active-y > .ps-scrollbar-y-rail {
    display: block;
    background-color: transparent;
}

.ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: transparent; /* background color when dragged away */
    opacity: 0.9;
}

.ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #aaa; /* scrollbar color when dragged away */
    height: 5px;
}

.ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: transparent; /* background color when dragged away */
    opacity: 0.9;
}

.ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #aaa; /* scrollbar color when dragged away */
    width: 5px;
}

.ps-container > .ps-scrollbar-x-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    opacity: 0.2; /* the opacity when not on hover of the content */
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    bottom: 0px;
    /* there must be 'bottom' for ps-scrollbar-x-rail */
    height: 15px;
}

.ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    position: absolute;
    /* please don't change 'position' */
    background-color: #666; /* #aaa; the color on content hover */
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    -o-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    -moz-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    bottom: 2px;
    /* there must be 'bottom' for ps-scrollbar-x */
    height: 5px; /* the width of the scrollbar */
}

.ps-container > .ps-scrollbar-x-rail:hover > .ps-scrollbar-x, .ps-container > .ps-scrollbar-x-rail:active > .ps-scrollbar-x {
    height: 4px;
}

.ps-container > .ps-scrollbar-y-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    opacity: 0.2; /* the opacity when not on hover of the content */
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    right: 0;
    /* there must be 'right' for ps-scrollbar-y-rail */
    width: 15px;
}

.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    position: absolute;
    /* please don't change 'position' */
    background-color: #666; /* #aaa; the color on content hover */
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;
    -o-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    -moz-transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;
    transition: background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;
    right: 2px;
    /* there must be 'right' for ps-scrollbar-y */
    width: 5px; /* the width of the scrollbar */
}

.ps-container > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y, .ps-container > .ps-scrollbar-y-rail:active > .ps-scrollbar-y {
    width: 5px;
}

.ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: transparent; /* background color when dragged */
    opacity: 0.9;
}

.ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #bbb; /* scrollbar color when dragged */
    height: 5px;
}

.ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: transparent; /* background color when dragged */
    opacity: 0.9;
}

.ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #bbb; /* scrollbar color when dragged */
    width: 5px;
}

.ps-container:hover > .ps-scrollbar-x-rail,
.ps-container:hover > .ps-scrollbar-y-rail {
    opacity: 0.6;
}

.ps-container:hover > .ps-scrollbar-x-rail:hover {
    background-color: transparent; /* the background color on hover of the scrollbar */
    opacity: 0.9;
}

.ps-container:hover > .ps-scrollbar-x-rail:hover > .ps-scrollbar-x {
    background-color: #999; /* scrollbar color on hover */
}

.ps-container:hover > .ps-scrollbar-y-rail:hover {
    background-color: transparent; /* the background color on hover of the scrollbar */
    opacity: 0.9;
}

.ps-container:hover > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y {
    background-color: #999; /* scrollbar color on hover */
}

.dygraph__history-tip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: none; /* overriden in js */
    margin-right: 25px;
    direction: rtl;
    overflow: hidden;
    pointer-events: none;
}

.dygraph__history-tip-content {
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    pointer-events: auto;
}
</style>
