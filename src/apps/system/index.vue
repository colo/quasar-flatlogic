<template>
  <router-view :key="$route.path +'.'+ JSON.stringify($route.query)"></router-view>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system')

export default {

  name: 'System',

  data () {
    return {

      id: 'system',
      path: 'all'

    }
  },

  methods: {

  }
}
</script>
