import * as Debug from 'debug'
const debug = Debug('apps:logs:web:sources:filter:day:requests')

// import END from '../../../etc/range'
// const end = require('../../../../etc/end')

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

const ss = require('simple-statistics')

// const _merge = function (prop, val1, val2) {
//   // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   let merged
//
//   if (!isNaN(val1)) { // && !isNaN(val2)
//     if (val2 === undefined) val2 = 0
//     merged = val1 + val2 * 1
//   } else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
//     // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
//     merged = {}
//
//     merged.max = ss.max([val1.max * 1, val2.max * 1])
//     merged.min = ss.min([val1.min * 1, val2.min * 1])
//     merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
//     merged.range = val1.max - val1.min
//     merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
//     merged.median = ss.median([val1.median * 1, val2.median * 1])
//     // delete val1.mode
//   } else if (
//     (prop !== 'geoip') &&
//     isNaN(val1) &&
//     isNaN(val2)
//   ) {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     // if (Array.isArray(val1)) {
//     //   merged = []
//     //   Array.each(val1, function (val1_data, val1_index) {
//     //     merged.push(_merge(prop, val1_data, val2[val1_index]))
//     //   })
//     // } else {
//     merged = {}
//     merged = _merge_objects(prop, val1, val2)
//     // }
//   } else if (prop === 'geoip') {
//     // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//     merged = {}
//     merged.city = _merge('city', val1.city, val2.city)
//     merged.country = _merge('country', val1.country, val2.country)
//     merged.continent = _merge('continent', val1.continent, val2.continent)
//     merged.registeredCountry = _merge('registeredCountry', val1.registeredCountry, val2.registeredCountry)
//
//     merged.location = {}
//
//     Object.each(val1.location, function (val1_data, val1_prop) {
//       if (!merged.location[val1_prop]) merged.location[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.location[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.location, function (val2_data, val2_prop) {
//       if (!merged.location[val2_prop]) merged.location[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.location[val2_prop].count += val2_data.count
//     })
//
//     merged.ip = {}
//
//     Object.each(val1.ip, function (val1_data, val1_prop) {
//       if (!merged.ip[val1_prop]) merged.ip[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })
//
//       merged.ip[val1_prop].count += val1_data.count
//     })
//
//     Object.each(val2.ip, function (val2_data, val2_prop) {
//       if (!merged.ip[val2_prop]) merged.ip[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })
//
//       merged.ip[val2_prop].count += val2_data.count
//     })
//   } else {
//     debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
//   }
//   return merged
// }

// const _merge_objects = function (prop, val1, val2) {
//   let merged = {}
//   let _used_props = []
//   Object.each(val1, function (val1_data, val1_prop) {
//     if (val2 && val2[val1_prop]) {
//       merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
//     } else {
//       merged[val1_prop] = val1_data
//     }
//     _used_props.push(val1_prop)
//   })
//
//   Object.each(val2, function (val2_data, val2_prop) {
//     if (!_used_props.contains(val2_prop)) {
//       if (val1 && val1[val2_prop]) {
//         merged[val2_prop] = _merge(prop, val2_data, val1[val2_prop])
//       } else {
//         merged[val2_prop] = val2_data
//       }
//     }
//   })
//   return merged
// }

// let per_domain = {}
// let per_host = {}

const generic_callback = function (data, metadata, key, vm) {
  // debug('HISTORICAL HOST CALLBACK data %s %o', key, data)

  const END = vm.end_day()
  const TOP = vm.top

  if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
    data = JSON.parse(JSON.stringify(data))
    debug('HISTORICAL HOST CALLBACK data %s %o', key, data)
    // let type
    // let vm_data = {}
    let per_domain = {}
    let per_host = {}

    let range = {start: undefined, end: undefined}
    let per_host_range = {start: undefined, end: undefined}
    let timestamp = data.logs_historical[0].metadata.timestamp // comes sorted by timestamp in desc order, so first item has the biggest timestamp
    let smallest_start = roundHours(timestamp)

    Array.each(data.logs_historical, function (row) {
      let start = row.metadata.range.start
      let end = row.metadata.range.end

      if (start >= smallest_start) { // discard any document that is previous to our smallest_start timestamp
        if (range.start === undefined || range.start > start) { range.start = start }

        if (range.end === undefined || range.end < end) { range.end = end }

        // if (timestamp === undefined || timestamp < row.metadata.timestamp) { timestamp = row.metadata.timestamp }

        if (Array.isArray(row.metadata.host)) {
          let domain = row.metadata.domain
          if (!per_domain[domain]) per_domain[domain] = row.data
        } else {
          let host = row.metadata.host
          if (!per_host[host]) per_host[host] = row.data
        }
      }
      // if (!type) type = row.metadata.type
      // Object.each(row.data, function (row_data, prop) {
      //   if (!vm_data[prop]) {
      //     vm_data[prop] = JSON.parse(JSON.stringify(row_data[0].value))
      //   } else if (row_data[0] && row_data[0].value) {
      //     // if (prop === 'user_agent') {
      //     //   // debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop, vm_data[prop], row_data)
      //     //   debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop)
      //     //   vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // }
      //     vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
      //     // debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, prop, row_data)
      //   }
      // })
      //
      // if (Object.getLength(vm_data) > 0) {
      //   vm[type] = vm_data
      // }
    })

    let world_map_city_counter = []
    let city_counter = {}
    let country_counter = {}
    let continent_counter = {}

    Object.each(per_domain, function (data, domain) {
      if (data.geoip) {
        Object.each(data.geoip.location, function (row) {
          world_map_city_counter.push({
            title: row.city + ' ( hits: ' + row.count.length + ' )',
            latitude: row.latitude,
            longitude: row.longitude
          })

          let country = (row.country) ? row.country : undefined
          let continent = (row.continent) ? row.continent : undefined
          let city = (row.city && country) ? row.city + ' - ' + country : undefined

          // let world_map_city = (row.location && row.location.latitude && row.location.longitude) ? row.location + ':' + row.location.latitude : undefined
          // let world_map_city_name = (row.city) ? (row.city.names) ? (row.city.names.en) ? row.city.names.en + ' - ' + country : row.city.names.es + ' - ' + country : undefined : undefined

          if (city !== undefined && !city_counter[city]) city_counter[city] = 0
          if (city !== undefined) city_counter[city] += row.count.length

          if (country !== undefined && !country_counter[country]) country_counter[country] = 0
          if (country !== undefined) country_counter[country] += row.count.length

          if (continent !== undefined && !continent_counter[continent]) continent_counter[continent] = 0
          if (continent !== undefined) continent_counter[continent] += row.count.length
        })
      }
    })

    let top_city_counter = {}
    let _top_city_counter = []
    Object.each(city_counter, function (data, city) {
      _top_city_counter.push(data)
    })

    _top_city_counter = _top_city_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_city_counter[i]

      Object.each(city_counter, function (data, city) {
        if (data === value) {
          top_city_counter[city] = data
        }
      })
    }

    let top_country_counter = {}
    let _top_country_counter = []
    Object.each(country_counter, function (data, country) {
      _top_country_counter.push(data)
    })

    _top_country_counter = _top_country_counter.sort((a, b) => b - a)

    for (let i = 0; i < TOP; i++) {
      let value = _top_country_counter[i]

      Object.each(country_counter, function (data, country) {
        if (data === value) {
          top_country_counter[country] = data
        }
      })
    }

    debug('HISTORICAL HOST CALLBACK data %s %o %o', key, top_city_counter, top_country_counter)

    vm.$set(vm.day, 'per_domain', per_domain)
    vm.$set(vm.day, 'per_host', per_host)
    vm.$set(vm.day, 'range', range)
    vm.$set(vm.day, 'timestamp', timestamp)
    vm.$set(vm.day, 'world_map_cities', world_map_city_counter)

    vm.$set(vm.day, 'city_counter', city_counter)
    vm.$set(vm.day, 'country_counter', country_counter)
    vm.$set(vm.day, 'top_city_counter', top_city_counter)
    vm.$set(vm.day, 'top_country_counter', top_country_counter)

    vm.$set(vm.day, 'continent_counter', continent_counter)

    debug('HISTORICAL HOST CALLBACK data %s %o', key, city_counter, country_counter, continent_counter)
    // // data = data.logs_historical[0]
    //
    // // if (/minute/.test(key)){
    // //   const START = END - MINUTE
    // // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      // key = ['periodical.once', 'historical.day.once', 'historical.day.once', 'historical.day.once']// 'config.once',
      key = ['historical.day.once']// 'config.once',
    }

    if (
      _key
    ) {
      // const END = 1586055600972 //= > test data
      const END = vm.end_day()

      /**
      * production
      **/
      // const END = Date.now()

      let START

      // let filter = "this.r.row('metadata')('path').eq('logs.web').and("
      let filter = ["r.row('metadata')('tag').contains('web')"]

      Object.each(vm.filter, function (value, prop) {
        // filter += "this.r.row('metadata')('" + prop + "').eq('" + value + "').and("
        filter.push('function:' +
        "row('metadata')('" + prop + "').do(function(val) {" +
        "  return this.r.branch(val.typeOf().eq('ARRAY'), val.contains('" + value + "'), val.eq('" + value + "'))" +
        '}.bind(this))'
        )
      })

      debug('FILTER ARRAY %o', filter)

      switch (_key) {
        // case 'periodical.once':
        //   // START = END - MINUTE
        //   // START = END - (15 * SECOND)
        //   START = (END - (15 * SECOND) >= 0) ? END - (15 * SECOND) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('periodical')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // "this.r.row('metadata')('path').eq('logs.web').and("
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs',
        //       // 'register': 'changes',
        //       // 'format': 'stat',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //         // { 'limit': 10 }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('periodical')"
        //       // ]
        //
        //     }
        //   }]
        //   break

        case 'historical.day.once':
          // START = END - MINUTE
          START = (END - DAY >= 0) ? END - DAY : 0

          // filter += "this.r.row('metadata')('type').eq('minute')"
          filter.push("r.row('metadata')('type').eq('day')")
          // Object.each(vm.filter, function (value, prop) {
          //   filter += ')'
          // })
          //
          // filter += ')' // -> "this.r.row('metadata')('path').eq('logs.web').and("

          debug('FILTER ARRAY %s', filter)

          source = [{
            params: { id: _key },
            path: 'all',
            // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
            range: 'posix ' + START + '-' + END + '/*',
            query: {
              'from': 'logs_historical',
              // 'register': 'changes',
              // 'format': 'stat',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                // {
                //   'metadata': [
                //     'timestamp',
                //     'path'
                //   ]
                // },
                {'data': 'geoip'},
                'metadata'
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              filter: filter
              // 'filter': [
              //   { 'metadata': vm.filter },
              //   "r.row('metadata')('type').eq('minute')"
              // ]

            }
          }]

          break

        // case 'historical.hour.once':
        //   // START = END - HOUR
        //   START = (END - (2 * HOUR) >= 0) ? END - (2 * HOUR) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('hour')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> "this.r.row('metadata')('path').eq('logs.web').and("
        //
        //   debug('FILTER STRING HOUR %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       // 'format': 'stat',
        //       'index': false,
        //       /**
        //       * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //       **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
        //
        // case 'historical.day.once':
        //   // START = END - DAY
        //   START = (END - DAY >= 0) ? END - DAY : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('day')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> "this.r.row('metadata')('path').eq('logs.web').and("
        //
        //   debug('FILTER STRING %s', filter)
        //
        //   source = [{
        //     params: { id: _key },
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (7 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: 'posix ' + START + '-' + END + '/*',
        //     query: {
        //       'from': 'logs_historical',
        //       // 'register': 'changes',
        //       'format': 'stat',
        //       'index': false,
        //       /**
        //         * right now needed to match OUTPUT 'id' with this query (need to @fix)
        //         **/
        //       'q': [
        //         // {
        //         //   'metadata': [
        //         //     'timestamp',
        //         //     'path'
        //         //   ]
        //         // },
        //         'data',
        //         'metadata'
        //       ],
        //       'transformation': [
        //         {
        //           'orderBy': { 'index': 'r.desc(timestamp)' }
        //         }
        //       ],
        //       filter: filter
        //       // 'filter': [
        //       //   { 'metadata': vm.filter },
        //       //   "r.row('metadata')('type').eq('hour')"
        //       // ]
        //
        //     }
        //   }]
        //
        //   break
      }
    }

    debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: generic_callback

}

const once = [
  // host_once_register,
  host_once_component
]

const periodical = [
  // host_range_component
  host_once_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
