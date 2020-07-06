<template>
  <q-card>
    <q-card-section class="bg-primary">
      <q-btn
        flat
        :to="{
          name: 'os_host',
          params: { host: host },
        }"
      >
      {{host}}
    </q-btn>
    </q-card-section>

    <q-card-section :style="'height: 200px; width: 334px'">
      <vue-canvas-gauge
        title="test"
        id="test"
        :chart="{
          class: 'netdata-chart netdata-gauge-chart',
          type: 'radial-gauge',
          options: {
            barWidth: 20,
            barShadow: 1,
            borderShadowWidth: 0,
            borderInnerWidth: 0,
            borderOuterWidth: 0,
            borderMiddleWidth: 0,
            highlights: false,
            valueBoxStroke: 0,
            colorValueBoxShadow: 0,
            valueBoxBorderRadius: 0,
            valueTextShadow: 0,
            colorValueBoxBackground: 'transparent',

            endAngle: 120,
            needle: true,
            minValue: 0.0,
            maxValue: 100,
            units: '%',
            height: 200,
            width: 334,
            lines: 12,                  // The number of lines to draw
            angle: 0.14,                // The span of the gauge arc
            lineWidth: 0.57,            // The line thickness
            radiusScale: 1.0,           // Relative radius
            pointer: {
                length: 0.85,           // 0.9 The radius of the inner circle
                strokeWidth: 0.045,     // The rotation offset
                /* color: pointerColor     // Fill color */
            },
            limitMax: true,             // If false, the max value of the gauge will be updated if value surpass max
            limitMin: true,             // If true, the min value of the gauge will be fixed unless you set it manually
            /* colorStart: startColor,     // Colors */
            /* colorStop: stopColor,       // just experiment with them */
            /* strokeColor: strokeColor,   // to see which ones work best for you */
            /* generateGradient: (generateGradient === true), // gmosx: */
            gradientType: 0,
            highDpiSupport: true        // High resolution support
          }
        }"
      />
    </q-card-section>

    <q-separator dark />

    <q-card-actions>
      <q-btn
        v-for="category in categories"
        :key="host+'.'+category"
        flat
        :to="{
          name: 'os_host',
          params: { host: host },
          hash: '#'+category
        }"
      >{{category}}</q-btn>
    </q-card-actions>
  </q-card>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:os:components:hostCard')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/os/pipelines/index'

// import DataSourcesMixin from '@mixins/dataSources'

// import { requests, store } from './sources/index'

import vueCanvasGauge from './wrappers/vueCanvasGauge'

export default {
  // mixins: [DataSourcesMixin],
  // extends: DataSourcesMixin,
  components: { vueCanvasGauge },

  name: 'OsHostCard',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,
  props: {
    host: {
      type: String,
      default: ''
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
