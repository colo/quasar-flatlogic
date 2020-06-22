import * as Debug from 'debug'
const debug = Debug('apps:logs:web:sources:filter:minute:requests')

// import END from '../../../etc/range'
const end = require('../../../../etc/end')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24

let total_bytes_sent = {}
let hits = {}

let user_agent_os_counter = {}
let user_agent_os_family_counter = {}
let user_agent_engine_counter = {}
let user_agent_browser_counter = {}
let user_agent_device_counter = {}

let status_counter = {}

let city_counter = {}
let country_counter = {}
let continent_counter = {}
let world_map_city_counter = []

let addr_counter = {}
let user_counter = {}
let referer_counter = {}

let type_counter = {}

import static_types from '../../../data/static_extentions'
const ss = require('simple-statistics')

const _merge = function (prop, val1, val2) {
  // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
  let merged

  if (!isNaN(val1)) { // && !isNaN(val2)
    if (val2 === undefined) val2 = 0
    merged = val1 + val2 * 1
  } else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
    // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
    merged = {}

    merged.max = ss.max([val1.max * 1, val2.max * 1])
    merged.min = ss.min([val1.min * 1, val2.min * 1])
    merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
    merged.range = val1.max - val1.min
    merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
    merged.median = ss.median([val1.median * 1, val2.median * 1])
    // delete val1.mode
  } else if (
    (prop !== 'geoip') &&
    isNaN(val1) &&
    isNaN(val2)
  ) {
    // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
    // if (Array.isArray(val1)) {
    //   merged = []
    //   Array.each(val1, function (val1_data, val1_index) {
    //     merged.push(_merge(prop, val1_data, val2[val1_index]))
    //   })
    // } else {
    merged = {}
    merged = _merge_objects(prop, val1, val2)
    // }
  } else if (prop === 'geoip') {
    // debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
    merged = {}
    merged.city = _merge('city', val1.city, val2.city)
    merged.country = _merge('country', val1.country, val2.country)
    merged.continent = _merge('continent', val1.continent, val2.continent)
    merged.registeredCountry = _merge('registeredCountry', val1.registeredCountry, val2.registeredCountry)

    merged.location = {}

    Object.each(val1.location, function (val1_data, val1_prop) {
      if (!merged.location[val1_prop]) merged.location[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })

      merged.location[val1_prop].count += val1_data.count
    })

    Object.each(val2.location, function (val2_data, val2_prop) {
      if (!merged.location[val2_prop]) merged.location[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })

      merged.location[val2_prop].count += val2_data.count
    })

    merged.ip = {}

    Object.each(val1.ip, function (val1_data, val1_prop) {
      if (!merged.ip[val1_prop]) merged.ip[val1_prop] = Object.merge(Object.clone(val1_data), { count: 0 })

      merged.ip[val1_prop].count += val1_data.count
    })

    Object.each(val2.ip, function (val2_data, val2_prop) {
      if (!merged.ip[val2_prop]) merged.ip[val2_prop] = Object.merge(Object.clone(val2_data), { count: 0 })

      merged.ip[val2_prop].count += val2_data.count
    })
  } else {
    debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
  }
  return merged
}

const _merge_objects = function (prop, val1, val2) {
  let merged = {}
  let _used_props = []
  Object.each(val1, function (val1_data, val1_prop) {
    if (val2 && val2[val1_prop]) {
      merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
    } else {
      merged[val1_prop] = val1_data
    }
    _used_props.push(val1_prop)
  })

  Object.each(val2, function (val2_data, val2_prop) {
    if (!_used_props.contains(val2_prop)) {
      if (val1 && val1[val2_prop]) {
        merged[val2_prop] = _merge(prop, val2_data, val1[val2_prop])
      } else {
        merged[val2_prop] = val2_data
      }
    }
  })
  return merged
}

const generic_callback = function (data, metadata, key, vm) {
  // debug('HOST CALLBACK data %s %o', key, data)

  const END = end()
  // const END = 15000 //= > test data
  // const END = Date.now() // production

  // if (/minute/.test(key) && data) { // (data.logs || Object.getLength(data) > 0)
  //   // const START = END - MINUTE
  //   // const START = END - (15 * SECOND)
  //   const START = (END - (5 * SECOND) >= 0) ? END - (5 * SECOND) : 0
  //
  //   let _data
  //   if (data.logs) _data = data.logs // comes from 'Range'
  //   else _data = data // comes from 'register'
  //
  //   if (!_data.data) _data.data = {}
  //
  //   debug('PERIODICAL HOST CALLBACK _data %o', _data)
  //
  //   /**
  //   * logs
  //   **/
  //   let logs = []
  //   let log_template = _data[0].metadata
  //   Array.each(_data[0].data.log, function (row) {
  //     logs.push(Object.merge(Object.clone(log_template), { log: row.value, timestamp: row.timestamp }))
  //   })
  //
  //   /**
  //   * bytes & hits
  //   **/
  //   let current_bytes_sent = 0
  //   Array.each(_data[0].data.body_bytes_sent, function (row, index) {
  //     if (index === 0) {
  //       current_bytes_sent = row.value
  //     }
  //
  //     if (!hits[row.timestamp]) hits[row.timestamp] = 0
  //     hits[row.timestamp] += 1
  //
  //     if (!total_bytes_sent[row.timestamp]) total_bytes_sent[row.timestamp] = 0
  //     total_bytes_sent[row.timestamp] += row.value
  //   })
  //
  //   let minute_total_bytes_sent = 0
  //   let minute_hits = 0
  //   Object.each(total_bytes_sent, function (val, ts) {
  //     if (ts < START) {
  //       delete total_bytes_sent[ts]
  //       delete hits[ts]
  //     } else {
  //       let hit = hits[ts]
  //       minute_total_bytes_sent += val
  //       minute_hits += hit
  //     }
  //   })
  //
  //   /**
  //   * status
  //   **/
  //   Array.each(_data[0].data.status, function (row, index) {
  //     if (!status_counter[row.timestamp]) status_counter[row.timestamp] = {}
  //     if (!status_counter[row.timestamp][row.value]) status_counter[row.timestamp][row.value] = 0
  //     status_counter[row.timestamp][row.value] += 1
  //   })
  //
  //   let minute_status_counter = {}
  //   Object.each(status_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete status_counter[ts]
  //     } else {
  //       Object.each(val, function (data, status) {
  //         if (!minute_status_counter[status]) minute_status_counter[status] = 0
  //         minute_status_counter[status] += data
  //       })
  //     }
  //   })
  //
  //   /**
  //   * city - country - continent
  //   **/
  //   let _tmp_minute_world_map_city_counter = {}
  //   Array.each(_data[0].data.geoip, function (row, index) {
  //     let country = (row.value.country) ? (row.value.country.names) ? (row.value.country.names.en) ? row.value.country.names.en : row.value.country.names.es : undefined : undefined
  //     let continent = (row.value.continent) ? (row.value.continent.names) ? (row.value.continent.names.en) ? row.value.continent.names.en : row.value.continent.names.es : undefined : undefined
  //     let city = (row.value.city && country) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
  //
  //     let world_map_city = (row.value.location && row.value.location.latitude && row.value.location.longitude) ? row.value.location + ':' + row.value.location.latitude : undefined
  //     let world_map_city_name = (row.value.city) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
  //
  //     if (city && !city_counter[row.timestamp]) city_counter[row.timestamp] = {}
  //     if (country && !country_counter[row.timestamp]) country_counter[row.timestamp] = {}
  //     if (continent && !continent_counter[row.timestamp]) continent_counter[row.timestamp] = {}
  //
  //     if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp]) world_map_city_counter[row.timestamp] = {}
  //
  //     if (city && country && !city_counter[row.timestamp][city]) city_counter[row.timestamp][city] = 0
  //     if (country && !country_counter[row.timestamp][country]) country_counter[row.timestamp][country] = 0
  //     if (continent && !continent_counter[row.timestamp][continent]) continent_counter[row.timestamp][continent] = 0
  //
  //     if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp][world_map_city]) world_map_city_counter[row.timestamp][world_map_city] = { name: world_map_city_name, count: 0, latitude: row.value.location.latitude, longitude: row.value.location.longitude }
  //
  //     if (city) { city_counter[row.timestamp][city] += 1 }
  //     if (country) country_counter[row.timestamp][country] += 1
  //     if (continent) continent_counter[row.timestamp][continent] += 1
  //
  //     if (world_map_city && world_map_city_name) world_map_city_counter[row.timestamp][world_map_city].count += 1
  //   })
  //
  //   let minute_city_counter = {}
  //   let minute_country_counter = {}
  //   let minute_continent_counter = {}
  //
  //   Object.each(city_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete city_counter[ts]
  //       delete country_counter[ts]
  //       delete continent_counter[ts]
  //       delete world_map_city_counter[ts]
  //     } else {
  //       let country_val = country_counter[ts]
  //       let continent_val = continent_counter[ts]
  //       let world_map_city_val = world_map_city_counter[ts]
  //
  //       Object.each(val, function (data, city) {
  //         if (!minute_city_counter[city]) minute_city_counter[city] = 0
  //         minute_city_counter[city] += data
  //       })
  //
  //       Object.each(country_val, function (data, country) {
  //         if (!minute_country_counter[country]) minute_country_counter[country] = 0
  //         minute_country_counter[country] += data
  //       })
  //
  //       Object.each(continent_val, function (data, continent) {
  //         if (!minute_continent_counter[continent]) minute_continent_counter[continent] = 0
  //         minute_continent_counter[continent] += data
  //       })
  //
  //       Object.each(world_map_city_val, function (data, world_map_city) {
  //         // if (!minute_continent_counter[continent]) minute_continent_counter[continent] = 0
  //         // minute_continent_counter[continent] += data
  //
  //         if (!_tmp_minute_world_map_city_counter[world_map_city]) {
  //           _tmp_minute_world_map_city_counter[world_map_city] = data
  //         } else {
  //           _tmp_minute_world_map_city_counter[world_map_city].count += data.count
  //         }
  //       })
  //     }
  //   })
  //
  //   let minute_world_map_city_counter = []
  //
  //   Object.each(_tmp_minute_world_map_city_counter, function (data, world_map_city) {
  //     minute_world_map_city_counter.push({
  //       title: data.name + ' ( hits: ' + data.count + ' )',
  //       latitude: data.latitude,
  //       longitude: data.longitude
  //     })
  //   })
  //
  //   /**
  //   * address (IP)
  //   **/
  //   Array.each(_data[0].data.remote_addr, function (row, index) {
  //     if (!addr_counter[row.timestamp]) addr_counter[row.timestamp] = {}
  //     if (!addr_counter[row.timestamp][row.value]) addr_counter[row.timestamp][row.value] = 0
  //     addr_counter[row.timestamp][row.value] += 1
  //   })
  //
  //   let minute_addr_counter = {}
  //   Object.each(addr_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete addr_counter[ts]
  //     } else {
  //       Object.each(val, function (data, addr) {
  //         if (!minute_addr_counter[status]) minute_addr_counter[addr] = 0
  //         minute_addr_counter[addr] += data
  //       })
  //     }
  //   })
  //
  //   /**
  //   * user
  //   **/
  //   Array.each(_data[0].data.remote_user, function (row, index) {
  //     if (!user_counter[row.timestamp]) user_counter[row.timestamp] = {}
  //     if (!user_counter[row.timestamp][row.value]) user_counter[row.timestamp][row.value] = 0
  //     user_counter[row.timestamp][row.value] += 1
  //   })
  //
  //   let minute_user_counter = {}
  //   Object.each(user_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete user_counter[ts]
  //     } else {
  //       Object.each(val, function (data, user) {
  //         if (!minute_user_counter[user]) minute_user_counter[user] = 0
  //         minute_user_counter[user] += data
  //       })
  //     }
  //   })
  //
  //   /**
  //   * Static & Dynamic types
  //   **/
  //   Array.each(_data[0].data.pathname, function (row, index) {
  //     let value = (static_types.test(row.value)) ? 'static' : 'dynamic'
  //     // debug('TYPE %o', row.value, type)
  //     if (!type_counter[row.timestamp]) type_counter[row.timestamp] = {}
  //     if (!type_counter[row.timestamp][value]) type_counter[row.timestamp][value] = 0
  //     type_counter[row.timestamp][value] += 1
  //   })
  //
  //   let minute_type_counter = {}
  //   Object.each(type_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete type_counter[ts]
  //     } else {
  //       Object.each(val, function (data, type) {
  //         if (!minute_type_counter[type]) minute_type_counter[type] = 0
  //         minute_type_counter[type] += data
  //       })
  //     }
  //   })
  //
  //   /**
  //   * referer
  //   **/
  //   Array.each(_data[0].data.referer, function (row, index) {
  //     // debug('REFERER %o', row.value)
  //     let value = (row.value.referer) ? row.value.referer + ' - ' + row.value.medium : row.value.medium
  //     if (!referer_counter[row.timestamp]) referer_counter[row.timestamp] = {}
  //     if (!referer_counter[row.timestamp][value]) referer_counter[row.timestamp][value] = 0
  //     referer_counter[row.timestamp][value] += 1
  //   })
  //
  //   let minute_referer_counter = {}
  //   Object.each(referer_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete referer_counter[ts]
  //     } else {
  //       Object.each(val, function (data, referer) {
  //         if (!minute_referer_counter[referer]) minute_referer_counter[referer] = 0
  //         minute_referer_counter[referer] += data
  //       })
  //     }
  //   })
  //
  //   /**
  //   * User Agent
  //   **/
  //   Array.each(_data[0].data.user_agent, function (row, index) {
  //     // debug('OS %s', row.value.os.family)
  //
  //     let os = row.value.os.family
  //
  //     user_agent_os_family_counter[row.timestamp] = os
  //
  //     os = (row.value.os.major) ? os + ' ' + row.value.os.major : os
  //     // os = (row.value.os.minor) ? os + '.' + row.value.os.minor : os
  //     user_agent_os_counter[row.timestamp] = os
  //
  //     let engine = row.value.engine.family
  //     engine = (row.value.engine.major) ? engine + ' ' + row.value.engine.major : engine
  //     engine = (row.value.engine.minor) ? engine + '.' + row.value.engine.minor : engine
  //     engine = (row.value.engine.patch) ? engine + '.' + row.value.engine.patch : engine
  //
  //     user_agent_engine_counter[row.timestamp] = engine
  //
  //     let browser = row.value.ua.family
  //     browser = (row.value.ua.major) ? browser + ' ' + row.value.ua.major : browser
  //     browser = (row.value.ua.minor) ? browser + '.' + row.value.ua.minor : browser
  //     browser = (row.value.ua.patch) ? browser + '.' + row.value.ua.patch : browser
  //     browser = (row.value.ua.type) ? browser + ' ' + row.value.ua.type : browser
  //
  //     user_agent_browser_counter[row.timestamp] = browser
  //
  //     // let device = row.value.device.family
  //     // device = (row.value.device.brand) ? device + ' ' + row.value.device.brand : device
  //     // device = (row.value.device.model) ? device + '.' + row.value.device.model : device
  //     // device = (row.value.device.type) ? device + '.' + row.value.device.type : device
  //
  //     let device = (row.value.device.brand) ? row.value.device.brand : row.value.device.family
  //     device = (row.value.device.model) ? device + ' ' + row.value.device.model : device
  //     device = (row.value.device.type) ? device + ' - ' + row.value.device.type : device
  //
  //     user_agent_device_counter[row.timestamp] = device
  //   })
  //
  //   let minute_user_agent_os_counter = {}
  //   let minute_user_agent_os_family_counter = {}
  //   let minute_user_agent_engine_counter = {}
  //   let minute_user_agent_browser_counter = {}
  //   let minute_user_agent_device_counter = {}
  //
  //   Object.each(user_agent_os_counter, function (val, ts) {
  //     if (ts < START) {
  //       delete user_agent_os_counter[ts]
  //       delete user_agent_os_family_counter[ts]
  //     } else {
  //       let family = user_agent_os_family_counter[ts]
  //       let engine = user_agent_engine_counter[ts]
  //       let browser = user_agent_browser_counter[ts]
  //       let device = user_agent_device_counter[ts]
  //
  //       if (!minute_user_agent_os_counter[val]) minute_user_agent_os_counter[val] = 0
  //       if (!minute_user_agent_os_family_counter[family]) minute_user_agent_os_family_counter[family] = 0
  //       if (!minute_user_agent_engine_counter[engine]) minute_user_agent_engine_counter[engine] = 0
  //       if (!minute_user_agent_browser_counter[browser]) minute_user_agent_browser_counter[browser] = 0
  //       if (!minute_user_agent_device_counter[device]) minute_user_agent_device_counter[device] = 0
  //
  //       minute_user_agent_os_counter[val] += 1
  //       minute_user_agent_os_family_counter[family] += 1
  //       minute_user_agent_engine_counter[engine] += 1
  //       minute_user_agent_browser_counter[browser] += 1
  //       minute_user_agent_device_counter[device] += 1
  //     }
  //   })
  //
  //   // vm.minute = {}
  //
  //   if (logs.length > 0) {
  //     // vm.logs = logs
  //     vm.$set(vm.minute, 'logs', logs)
  //     vm.loading_logs = false
  //   }
  //
  //   vm.$set(vm.minute, 'total_bytes_sent', minute_total_bytes_sent)
  //   vm.$set(vm.minute, 'hits', minute_hits)
  //
  //   vm.$set(vm.minute, 'current_bytes_sent', current_bytes_sent)
  //
  //   vm.$set(vm.minute, 'status_counter', minute_status_counter)
  //
  //   vm.$set(vm.minute, 'city_counter', minute_city_counter)
  //   vm.$set(vm.minute, 'country_counter', minute_country_counter)
  //   vm.$set(vm.minute, 'continent_counter', minute_continent_counter)
  //   vm.$set(vm.minute, 'world_map_cities', minute_world_map_city_counter)
  //
  //   vm.$set(vm.minute, 'addr_counter', minute_addr_counter)
  //   vm.$set(vm.minute, 'user_counter', minute_user_counter)
  //   vm.$set(vm.minute, 'referer_counter', minute_referer_counter)
  //   vm.$set(vm.minute, 'type_counter', minute_type_counter)
  //
  //   vm.$set(vm.minute, 'user_agent_os_counter', minute_user_agent_os_counter)
  //   vm.$set(vm.minute, 'user_agent_os_family_counter', minute_user_agent_os_family_counter)
  //   vm.$set(vm.minute, 'user_agent_engine_counter', minute_user_agent_engine_counter)
  //   vm.$set(vm.minute, 'user_agent_browser_counter', minute_user_agent_browser_counter)
  //   vm.$set(vm.minute, 'user_agent_device_counter', minute_user_agent_device_counter)
  // }
  // else
  if (/historical/.test(key) && data.logs_historical && Object.getLength(data.logs_historical) > 0) {
    debug('HISTORICAL HOST CALLBACK data %s %o', key, data)
    let type
    let vm_data = {}
    Object.each(data.logs_historical, function (row) {
      if (!type) type = row.metadata.type
      Object.each(row.data, function (row_data, prop) {
        if (!vm_data[prop]) {
          vm_data[prop] = JSON.parse(JSON.stringify(row_data[0].value))
        } else if (row_data[0] && row_data[0].value) {
          // if (prop === 'user_agent') {
          //   // debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop, vm_data[prop], row_data)
          //   debug('HISTORICAL HOST CALLBACK data %s %s %o %o', key, type, prop)
          //   vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
          // }
          vm_data[prop] = _merge(prop, vm_data[prop], JSON.parse(JSON.stringify(row_data[0].value)))
          // debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, prop, row_data)
        }
      })

      if (Object.getLength(vm_data) > 0) {
        // Object.each(vm_data, function (data, prop) {
        //   debug('HISTORICAL HOST CALLBACK PROP data %s %o', prop, data)
        // })
        // let _tmp_periodical_world_map_city_counter = {}
        let world_map_city_counter = []
        Object.each(vm_data.geoip.location, function (row) {
          world_map_city_counter.push({
            title: row.city + ' ( hits: ' + row.count + ' )',
            latitude: row.latitude,
            longitude: row.longitude
          })
          // let country = (row.value.country) ? (row.value.country.names) ? (row.value.country.names.en) ? row.value.country.names.en : row.value.country.names.es : undefined : undefined
          // let continent = (row.value.continent) ? (row.value.continent.names) ? (row.value.continent.names.en) ? row.value.continent.names.en : row.value.continent.names.es : undefined : undefined
          // let city = (row.value.city && country) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
          //
          // let world_map_city = (row.value.location && row.value.location.latitude && row.value.location.longitude) ? row.value.location + ':' + row.value.location.latitude : undefined
          // let world_map_city_name = (row.value.city) ? (row.value.city.names) ? (row.value.city.names.en) ? row.value.city.names.en + ' - ' + country : row.value.city.names.es + ' - ' + country : undefined : undefined
          //
          // if (city && !city_counter[row.timestamp]) city_counter[row.timestamp] = {}
          // if (country && !country_counter[row.timestamp]) country_counter[row.timestamp] = {}
          // if (continent && !continent_counter[row.timestamp]) continent_counter[row.timestamp] = {}
          //
          // if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp]) world_map_city_counter[row.timestamp] = {}
          //
          // if (city && country && !city_counter[row.timestamp][city]) city_counter[row.timestamp][city] = 0
          // if (country && !country_counter[row.timestamp][country]) country_counter[row.timestamp][country] = 0
          // if (continent && !continent_counter[row.timestamp][continent]) continent_counter[row.timestamp][continent] = 0
          //
          // if (world_map_city && world_map_city_name && !world_map_city_counter[row.timestamp][world_map_city]) world_map_city_counter[row.timestamp][world_map_city] = { name: world_map_city_name, count: 0, latitude: row.value.location.latitude, longitude: row.value.location.longitude }

          // if (city) { city_counter[row.timestamp][city] += 1 }
          // if (country) country_counter[row.timestamp][country] += 1
          // if (continent) continent_counter[row.timestamp][continent] += 1
          //
          // if (world_map_city && world_map_city_name) world_map_city_counter[row.timestamp][world_map_city].count += 1
        })
        vm_data['world_map_cities'] = world_map_city_counter
        vm[type] = vm_data
      }
    })

    debug('HISTORICAL HOST CALLBACK data %s %s %o', key, type, vm_data)
    // data = data.logs_historical[0]

    // if (/minute/.test(key)){
    //   const START = END - MINUTE
    // }
  }
}

const host_once_component = {
  params: function (_key, vm) {
    debug('PERIODICAL host_range_component %o %o', _key, vm.filter)

    let source
    let key

    if (!_key) {
      key = ['historical.minute.once']// , 'historical.minute.once', 'historical.hour.once', 'historical.day.once'
    }

    if (
      _key
    ) {
      // const END = 15000 //= > test data
      const END = end()

      /**
      * production
      **/
      // const END = Date.now()

      let START

      let filter = "this.r.row('metadata')('tag').contains('web').and("

      Object.each(vm.filter, function (value, prop) {
        filter += "this.r.row('metadata')('" + prop + "').eq('" + value + "').and("
      })

      debug('FILTER STRING %s', filter)

      switch (_key) {
        // case 'minute.once':
        //   // START = END - MINUTE
        //   // START = END - (15 * SECOND)
        //   START = (END - (5 * SECOND) >= 0) ? END - (5 * SECOND) : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('minute')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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
        //       'format': 'stat',
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
        //       //   "r.row('metadata')('type').eq('minute')"
        //       // ]
        //
        //     }
        //   }]
        //   break

        case 'historical.minute.once':
          // START = END - MINUTE
          START = (END - (2 * MINUTE) >= 0) ? END - (2 * MINUTE) : 0

          filter += "this.r.row('metadata')('type').eq('minute')"
          Object.each(vm.filter, function (value, prop) {
            filter += ')'
          })

          filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(

          debug('FILTER STRING %s', filter)

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
                'data',
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
        //   START = START(END - HOUR >= 0) ? END - HOUR : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('hour')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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
        //   START = START(END - DAY >= 0) ? END - DAY : 0
        //
        //   filter += "this.r.row('metadata')('type').eq('day')"
        //   Object.each(vm.filter, function (value, prop) {
        //     filter += ')'
        //   })
        //
        //   filter += ')' // -> this.r.row('metadata')('tag').contains('web').and(
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

    // debug('MyChart minute KEY ', key, source)

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
