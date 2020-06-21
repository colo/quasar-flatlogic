import * as Debug from 'debug'
const debug = Debug('apps:checks:sources:periodical:requests')

const MINUTE = 60000
const HOUR = MINUTE * 60

let _checks = {}

const checks_range = {
  params: function (_key, vm) {
    let source
    let key

    if (!_key) {
      key = ['checks.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        path: 'all',
        range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*', // (5 * MINUTE)
        query: {
          'from': 'educativa',
          'index': false,
          'q': [
            'data',
            { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
          ],
          'transformation': [
            { 'orderBy': { 'index': 'r.desc(timestamp)' } }
            // 'slice:0:9'
          ],
          'filter': [ { 'metadata': { 'type': 'check' } } ]
        }
      }]
    }

    return { key, source }
  },
  callback: function (data, meta, key, vm) {
    debug('All callback RANGE', data)

    if (data && data.educativa && data.educativa.length > 0) {
      // let _checks = []
      Array.each(data.educativa, function (check, index) {
        let host = check.metadata.host
        let _check = Object.merge(check.data, check.metadata)

        if (!_checks[host] || index === 0) _checks[host] = []

        _checks[host].push(_check)
        // _checks.combine([_check ])
      })

      let checks = []
      Object.each(_checks, function (data, host) {
        debug('All callback RANGE HOST', host)
        checks.combine(data)
      })

      checks.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })

      vm.checks = checks
      vm.loading = false
      // debug('All callback', checks, _checks)
    }
  }
}

// const checks_lasts = {
//   params: {
//     path: 'all',
//     query: {
//       'from': 'educativa',
//       'index': false,
//       'q': [
//         'data',
//         { 'metadata': ['host', 'timestamp', 'path'] }// timestamp give us last update
//       ],
//       'transformation': [
//         { 'orderBy': { 'index': 'r.desc(timestamp)' } },
//         'slice:0:9'
//       ],
//       'filter': [ { 'metadata': { 'type': 'check' } } ]
//     }
//   },
//   callback: function (data, meta, key, vm) {
//     // let _checks = []
//     debug('All callback ONCE', data)
//     Array.each(data.educativa, function (check, index) {
//       let host = check.metadata.host
//       let _check = Object.merge(check.data, check.metadata)
//
//       if (!_checks[host] || index === 0) _checks[host] = []
//
//       _checks[host].push(_check)
//       // _checks.combine([_check ])
//     })
//
//     let checks = []
//     Object.each(_checks, function (data) {
//       checks.combine(data)
//     })
//     checks.sort(function (a, b) { return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0) })
//
//     vm.checks = checks
//     vm.loading = false
//     debug('All callback', checks, _checks)
//   }
// }

const once = [
  checks_range
  // checks_lasts
]

const periodical = [
  checks_range
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
