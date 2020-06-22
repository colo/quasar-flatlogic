<template>
  <!-- <q-card>
    <q-card-section>
      <q-btn
        flat
        :to="{
          name: 'system_host',
          params: { host: host },
        }"
      >
        {{host}}
      </q-btn> -->

    <Widget
    >
    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
      <b-button-group class="mx-1">
        <b-button
          variant="primary"
          :to="{
            name: 'system_host',
            params: { host: host },
          }"
        >
          {{host}}
          <!-- <i class="fa fa-external-link"></i> -->
        </b-button>
      </b-button-group>
      <b-button-group class="mx-1" v-if="show_categories === true">
        <b-button
          variant="outline-info"
          v-for="category in categories"
          :key="host+'.'+category"
          :href="'/system/hosts/'+host+'#'+category"
        >
        <!-- :to="{
          name: 'system_host',
          params: { host: host },
          hash: '#'+category
        }" -->
          {{category}}
        </b-button>
      </b-button-group>
    </b-button-toolbar>

      <template v-if="Object.getLength(host_data) > 0">
        <div class="q-pa-md netdata-chart-row"  :style="'height: 200px'">
          <!-- ; width: 100%  -->

          <div class="row" :style="'width: 100%'">
            <div class="col">
              <vue-easy-pie-chart-wrapper
                :id="host+'.loadavg'"
                :chart="{
                  class: 'netdata-chart netdata-easypiechart-chart',
                  params:{
                    'bar-color': '#66AA00',
                    'size': 130,
                    /* 'percent': host_data['os.loadavg']['1_min'] || 0, */
                    'percent': (100 * host_data['os.loadavg']['1_min']  / host_data['os.loadavg.max']) || 0,
                    'value': host_data['os.loadavg']['1_min'],
                    'max': host_data['os.loadavg.max'] || 0,
                    'title': 'Load',
                    unit: '1min avg',
                    /**minValue: 0,
                    maxValue: 100,
                    unit: '%',
                    value: host_data['os.cpus.percentage'] || 0,
                    height: '200px',
                    width: '334px' */
                  }
                }"
              />
            </div>
            <div class="col">
              <vue-easy-pie-chart-wrapper
                :id="host+'.net.out'"
                :chart="{
                  class: 'netdata-chart netdata-easypiechart-chart',
                  params:{
                    'bar-color': '#3366CC',
                    'size': 150,
                    'percent': (100 * host_data['os.networkInterfaces.out'] / host_data['os.networkInterfaces.max.out']) || 0,
                    'value': host_data['os.networkInterfaces.out'] / 125,
                    'max': host_data['os.networkInterfaces.max.out'] || 0,
                    title: 'Net Outbound',
                    unit: 'kilobits/s',
                  }
                }"
              />
            </div>
            <div class="col">
              <vue-easy-pie-chart-wrapper
                :id="host+'.net.in'"
                :chart="{
                  class: 'netdata-chart netdata-easypiechart-chart',
                  params:{
                    'bar-color': '#DC3912',
                    'size': 150,
                    'percent': (100 * host_data['os.networkInterfaces.in'] / host_data['os.networkInterfaces.max.in']) || 0,
                    'value': host_data['os.networkInterfaces.in'] / 125,
                    'max': host_data['os.networkInterfaces.max.in'] || 0,
                    'title': 'Net Inbound',
                    'unit': 'kilobits/s'//'kilobits/s',
                  }
                }"
              />
            </div>
            <div class="col-3">
              <v-gauge-wrapper
                :id="host+'.cpu'"
                :chart="{
                  class: 'netdata-chart netdata-gauge-chart',
                  params:{
                    height: '180px',
                    title: 'CPU',
                    minValue: 0,
                    maxValue: 100,
                    value: host_data['os.cpus.percentage'] || 0,
                  }
                }"
              />
            </div>
            <template v-for="(used, mount) in host_data['os.mounts.used']">
              <div class="col" :key="host+'.'+mount+'.used'">
                <vue-easy-pie-chart-wrapper
                  :id="host+'.'+mount+'.used'"
                  :chart="{
                    class: 'netdata-chart netdata-easypiechart-chart',
                    params:{
                      'bar-color': '#AD69AD',
                      'size': 150,
                      'percent': used || 0,
                      'title': 'Used: '+ mount,
                      /* unit: 'kilobits/s', */
                    }
                  }"
                />
              </div>
            </template>

            <div class="col">
              <vue-easy-pie-chart-wrapper
                :id="host+'.ram'"
                :chart="{
                  class: 'netdata-chart netdata-easypiechart-chart',
                  params:{
                    'bar-color': '#66AA00',
                    'size': 130,
                    'percent': host_data['os.memory.percentage'] || 0,
                    'title': 'Used RAM',
                    /* unit: '%', */
                    /**minValue: 0,
                    maxValue: 100,
                    unit: '%',
                    value: host_data['os.cpus.percentage'] || 0,
                    height: '200px',
                    width: '334px' */
                  }
                }"
              />
            </div>
          </div>

        </div>
      </template>
    </Widget>

    <!-- </q-card-section>

    <q-card-section>
    </q-card-section>

    <q-separator dark />

    <q-card-actions>
      <q-btn
        v-for="category in categories"
        :key="host+'.'+category"
        flat
        :to="{
          name: 'system_host',
          params: { host: host },
          hash: '#'+category
        }"
      >{{category}}</q-btn>
    </q-card-actions>
  </q-card> -->

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:components:hostCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/os/pipelines/index'

// import DataSourcesMixin from '@components/mixins/dataSources'

// import { requests, store } from './sources/index'

import vGaugeWrapper from './wrappers/vGauge'
import vueEasyPieChartWrapper from './wrappers/vueEasyPieChart'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,
  components: { vGaugeWrapper, vueEasyPieChartWrapper },

  name: 'systemHostCard',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  props: {
    show_categories: {
      type: Boolean,
      default: true
    },
    host: {
      type: String,
      default: ''
    },
    host_data: {
      type: Object,
      default: () => ({})
    },
    categories: {
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
