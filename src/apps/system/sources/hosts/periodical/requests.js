import * as Debug from 'debug'
const debug = Debug('apps:system:sources:hosts:periodical:requests')

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

let max_networkInterfaces = {}
let max_loadavg = {}

/**
* _al hosts
**/
max_networkInterfaces['*'] = {in: 0, out: 0}
max_loadavg['*'] = 0

const _merge = function (val1, val2) {
  // debug('to _merge', prop, val1, val2)
  let merged

  // else if (isNaN(val1) && val1.max !== undefined && val1.min !== undefined) {
  //   // debug('HISTORICAL HOST CALLBACK data row %s %o', val1, val2)
  //   merged = {}
  //
  //   merged.max = ss.max([val1.max * 1, val2.max * 1])
  //   merged.min = ss.min([val1.min * 1, val2.min * 1])
  //   merged.sum = ss.sumSimple([val1.sum * 1, val2.sum * 1])
  //   merged.range = val1.max - val1.min
  //   merged.mean = ss.mean([val1.mean * 1, val2.mean * 1])
  //   merged.median = ss.median([val1.median * 1, val2.median * 1])
  //   // delete val1.mode
  // }
  if (!isNaN(val1) || typeof val1 === 'number') { // && !isNaN(val2)
    if (val2 === undefined) val2 = 0
    merged = val1 + val2 * 1
  } else if (
    Array.isArray(val1)
  ) {
    merged = val1.combine(val2)
  } else if (
    isNaN(val1) &&
    isNaN(val2)
  ) {
    merged = {}
    merged = _merge_objects(val1, val2)
  }
  // else {
  //   debug('HISTORICAL HOST CALLBACK data row merge %s %o %o', prop, val1, val2)
  // }
  // debug('to _merge', merged)
  return merged
}
// const _merge_arrays = function (val1, val2) {
//   merged = []
//   Array.each(val1, function (val1_data, val1_index) {
//     if (val2 && val2[val1_prop]) {
//       merged[val1_prop] = _merge(prop, val1_data, val2[val1_prop])
//     } else {
//       merged[val1_prop] = val1_data
//     }
//     _used_props.push(val1_prop)
//   })
//
// }

const _merge_objects = function (val1, val2) {
  let merged = {}
  let _used_props = []
  Object.each(val1, function (val1_data, val1_prop) {
    if (val2 && val2[val1_prop]) {
      merged[val1_prop] = _merge(val1_data, val2[val1_prop])
    } else {
      merged[val1_prop] = val1_data
    }
    _used_props.push(val1_prop)
  })

  Object.each(val2, function (val2_data, val2_prop) {
    if (!_used_props.contains(val2_prop)) {
      if (val1 && val1[val2_prop]) {
        merged[val2_prop] = _merge(val2_data, val1[val2_prop])
      } else {
        merged[val2_prop] = val2_data
      }
    }
  })
  return merged
}

const hosts_range_component = {
  params: function (_key, vm) {
    // debug('PERIODICAL host_range_component %o %o', _key, vm)

    // const MINUTE = 60000

    let source
    let key

    if (!_key) {
      // key = ['periodical.range', 'config.range', 'minute.range']
      key = ['periodical.range'] //, 'minute.range'
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      switch (_key) {
        case 'periodical.range':
          source = [{
            params: { id: _key },
            path: 'all',
            range: 'posix ' + roundMilliseconds((Date.now() - (5 * SECOND))) + '-' + roundMilliseconds(Date.now()) + '/*',
            query: {
              'from': 'os',
              // 'register': 'changes',
              // 'format': 'tabular',
              'index': false,
              /**
              * right now needed to match OUTPUT 'id' with this query (need to @fix)
              **/
              'q': [
                'data',
                {'metadata': ['host', 'path']}
              ],
              'transformation': [
                {
                  'orderBy': { 'index': 'r.desc(timestamp)' }
                }
              ],
              // 'filter': [
              //   "r.row('metadata')('path').ne('os.procs')",
              //   "this.r.row('metadata')('path').eq('os.cpus')" +
              //   ".or(this.r.row('metadata')('path').eq('os.memory')" +
              //   ".or(this.r.row('metadata')('path').eq('os.uptime')"+".or(this.r.row('metadata')('path').eq('os.loadavg')))"
              //
              // ]

            }
          }]
          break
      }
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  callback: function (data, metadata, key, vm) {
    // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, data)

    if (/periodical/.test(key) && (data.os || Object.getLength(data) > 0)) {
      let _data
      if (data.os) _data = data.os // comes from 'Range'
      else _data = data // comes from 'register'

      // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, _data)
      let _hosts_data = {}
      Array.each(_data, function (row, index) {
        let host = row.metadata.host
        let path = row.metadata.path

        if (!_hosts_data[host]) _hosts_data[host] = {}
        if (!_hosts_data[host][path]) _hosts_data[host][path] = []

        _hosts_data[host][path].push(row.data)
      })

      // debug('PERIODICAL HOSTS CALLBACK data %s %o', key, _hosts_data)

      let hosts_data = {}
      Object.each(_hosts_data, function (data, host) {
        if (!hosts_data[host]) hosts_data[host] = {}

        if (!max_networkInterfaces[host]) max_networkInterfaces[host] = {in: 0, out: 0}
        if (!max_loadavg[host]) max_loadavg[host] = 0

        Object.each(data, function (values, path) {
          if (!hosts_data[host][path]) hosts_data[host][path] = {}

          if (/^os\.networkInterfaces.*/.test(path) || /^os\.blockdevices.*/.test(path) || path === 'os.cpus') { // derived
            let current = {}
            Object.each(values[0], function (val, prop) {
              // debug('PERIODICAL HOSTS CALLBACK data %s %o', prop, val, values[1][prop])
              if (prop !== 'cores') {
                current[prop] = val - values[1][prop]
              } else {
                current[prop] = val
              }
            })

            hosts_data[host][path] = current
            if (path === 'os.cpus') {
              let total = hosts_data[host][path].cores * 10000
              let used = total - hosts_data[host][path].idle
              let percentage = ((used * 100) / total).toFixed(1) * 1
              if (percentage >= 0) {
                hosts_data[host][path + '.percentage'] = percentage
              }
            } else if (
              /^os\.networkInterfaces\.eth.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.eno.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.enp.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.vlan.*\.bytes$/.test(path) ||
              /^os\.networkInterfaces\.vnet.*\.bytes$/.test(path)
            ) {
              if (!hosts_data[host]['os.networkInterfaces.in']) hosts_data[host]['os.networkInterfaces.in'] = 0
              if (!hosts_data[host]['os.networkInterfaces.out']) hosts_data[host]['os.networkInterfaces.out'] = 0

              if (!hosts_data[host]['os.networkInterfaces.max.in']) hosts_data[host]['os.networkInterfaces.max.in'] = 0
              if (!hosts_data[host]['os.networkInterfaces.max.out']) hosts_data[host]['os.networkInterfaces.max.out'] = 0

              // // if (!max_networkInterfaces_out[host]) max_networkInterfaces_out[host] = 0
              //
              // max_networkInterfaces[host].in += hosts_data[host][path].recived * 1
              // max_networkInterfaces[host].out += hosts_data[host][path].transmited * 1

              // debug('PERIODICAL HOSTS CALLBACK networkInterfaces %s %o', key, hosts_data[host][path])

              //   // if (/^os\.networkInterfaces\.eth.*$/.test(path)) { // real ethX
              hosts_data[host]['os.networkInterfaces.in'] += hosts_data[host][path].recived * 1
              hosts_data[host]['os.networkInterfaces.out'] += hosts_data[host][path].transmited * 1
            //   // }
            }
          } else {
            hosts_data[host][path] = values[0]// most recent value
            if (path === 'os.memory') {
              let total = hosts_data[host][path].totalmem
              let used = total - hosts_data[host][path].freemem
              let percentage = ((used * 100) / total).toFixed(1) * 1
              if (percentage >= 0) {
                hosts_data[host][path + '.percentage'] = percentage
              }
            }

            if (path === 'os.loadavg') {
              if (!hosts_data[host]['os.loadavg.max']) hosts_data[host]['os.loadavg.max'] = 0
            }
          }

          // Array.each(values, function(val, index){
          //   if()
          // })
        })
      })

      Object.each(hosts_data, function (host_data, host) {
        // Object.each(host_data, function (path_data, path) {
        hosts_data[host]['os.networkInterfaces.max.in'] = (hosts_data[host]['os.networkInterfaces.in'] > max_networkInterfaces[host].in) ? hosts_data[host]['os.networkInterfaces.in'] : max_networkInterfaces[host].in
        hosts_data[host]['os.networkInterfaces.max.out'] = (hosts_data[host]['os.networkInterfaces.out'] > max_networkInterfaces[host].out) ? hosts_data[host]['os.networkInterfaces.out'] : max_networkInterfaces[host].out

        max_networkInterfaces[host] = {
          in: hosts_data[host]['os.networkInterfaces.max.in'],
          out: hosts_data[host]['os.networkInterfaces.max.out']
        }

        hosts_data[host]['os.loadavg.max'] = (hosts_data[host]['os.loadavg']['1_min'] > max_loadavg[host]) ? hosts_data[host]['os.loadavg']['1_min'] : max_loadavg[host]

        max_loadavg[host] = hosts_data[host]['os.loadavg.max']
        // })
      })

      /**
      * _all_hosts is merged data from all hosts
      **/
      let _all_hosts = {}
      Object.each(hosts_data, function (host_data, host) {
        host_data = JSON.parse(JSON.stringify(host_data))
        Object.each(host_data, function (val, path) {
          if (/^os\.networkInterfaces.*\.bytes$/.test(path)) {
            path = 'os.networkInterfaces.bytes'
          } else if (/^os\.networkInterfaces.*\.packets$/.test(path)) {
            path = 'os.networkInterfaces.packets'
          } else if (/^os\.mounts.*\.blocks$/.test(path)) {
            path = 'os.mounts.blocks'
          } else if (/^os\.blockdevices.*\.time/.test(path)) {
            path = 'os.blockdevices.time'
          } else if (/^os\.blockdevices.*\.sectors/.test(path)) {
            path = 'os.blockdevices.sectors'
          } else if (/^os\.blockdevices.*\.requests/.test(path)) {
            path = 'os.blockdevices.requests'
          }

          if (!_all_hosts[path]) {
            _all_hosts[path] = val
          } else {
            _all_hosts[path] = _merge(_all_hosts[path], val)
          }
        })
      })

      _all_hosts['os.networkInterfaces.in'] = _all_hosts['os.networkInterfaces.bytes'].recived * 1
      _all_hosts['os.networkInterfaces.out'] = _all_hosts['os.networkInterfaces.bytes'].transmited * 1

      _all_hosts['os.networkInterfaces.max.in'] = (_all_hosts['os.networkInterfaces.in'] > max_networkInterfaces['*'].in) ? _all_hosts['os.networkInterfaces.in'] : max_networkInterfaces['*'].in
      _all_hosts['os.networkInterfaces.max.out'] = (_all_hosts['os.networkInterfaces.out'] > max_networkInterfaces['*'].out) ? _all_hosts['os.networkInterfaces.out'] : max_networkInterfaces['*'].out

      max_networkInterfaces['*'] = {
        in: _all_hosts['os.networkInterfaces.max.in'],
        out: _all_hosts['os.networkInterfaces.max.out']
      }

      _all_hosts['os.loadavg.max'] = (_all_hosts['os.loadavg']['1_min'] > max_loadavg['*']) ? _all_hosts['os.loadavg']['1_min'] : max_loadavg['*']

      max_loadavg['*'] = _all_hosts['os.loadavg.max']

      let total = _all_hosts['os.cpus'].cores * 10000
      let used = total - _all_hosts['os.cpus'].idle
      let percentage = ((used * 100) / total).toFixed(1) * 1
      if (percentage >= 0) {
        _all_hosts['os.cpus.percentage'] = percentage
      }

      total = _all_hosts['os.memory'].totalmem
      used = total - _all_hosts['os.memory'].freemem
      percentage = ((used * 100) / total).toFixed(1) * 1
      if (percentage >= 0) {
        _all_hosts['os.memory.percentage'] = percentage
      }

      total = _all_hosts['os.mounts.blocks'].total
      used = _all_hosts['os.mounts.blocks'].used
      percentage = ((used * 100) / total).toFixed(1) * 1
      if (percentage >= 0) {
        _all_hosts['os.mounts.used'] = {'_ALL_': percentage}
      }

      hosts_data['_ALL_'] = _all_hosts
      /**
      * @end _all_hosts
      **/
      debug('PERIODICAL HOSTS CALLBACK data %s %o %o', key, hosts_data) //, max_networkInterfaces_in, max_networkInterfaces_out
      vm.hosts_data = hosts_data
    }
  }

}

const once = [
  hosts_range_component
]

const periodical = [
  hosts_range_component
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
