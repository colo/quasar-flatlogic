import * as Debug from 'debug'
const debug = Debug('apps:system:sources:hosts:minute:requests')

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

const os_hosts_paths = {
  params: function (_key, vm) {
    debug('PERIODICAL %o %o', _key, vm)

    let source
    let key

    if (!_key) {
      key = ['hosts.range']
    }

    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

    if (
      _key
    ) {
      source = [{
        params: { id: _key },
        // range: 'posix ' + (Date.now() - (15 * SECOND)) + '-' + Date.now() + '/*',
        range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
        path: 'all',
        query: {
          'from': 'os_historical',
          'index': 'host',
          'q': [
            // { 'config': 'graph' },
            // { 'metadata': ['host', 'path', 'tag'] } // 'path' ain't needed for first view (categories)
            { 'metadata': ['host', 'path'] } // 'path' ain't needed for first view (categories)
          ],
          'filter': [
            { 'metadata': { 'type': 'minute' } },
            "r.row('metadata')('path').ne('os.procs')"
          ],
          'aggregation': 'distinct'
        }
      }]
    }

    // debug('MyChart periodical KEY ', key, source)

    return { key, source }
  },
  // params: {
  //   path: 'all',
  //   query: {
  //     'from': 'os',
  //     'index': 'host',
  //     'q': [
  //       { 'config': 'graph' },
  //       { 'metadata': ['host'] } // 'path' ain't needed for first view (categories)
  //     ],
  //     'aggregation': 'distinct'
  //   }
  // },
  callback: function (data, meta, key, vm) {
    debug('CALLBACK', data)
    let _hosts_paths = {}
    let _paths = []

    if (data && data.os_historical && data.os_historical.length > 0) {
      Array.each(data.os_historical, function (host_group) {
        Array.each(host_group, function (plugin) {
          let host = plugin.metadata.host
          // debug('All callback', plugin)
          let path = (plugin.metadata.path) ? plugin.metadata.path : undefined

          if (!_hosts_paths[host]) _hosts_paths[host] = []

          if (path !== undefined) {
            path = path.replace('os.', '')
            if (path.indexOf('.') > -1) { path = path.substring(0, path.indexOf('.')) }
          }
          if (path !== undefined && !_hosts_paths[host].contains(path)) _hosts_paths[host].push(path)

          if (!_paths.contains(path)) _paths.push(path)
        })
      })

      Object.each(_hosts_paths, function (paths, host) {
        paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })
      })

      _paths.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0) })

      vm.hosts_paths = _hosts_paths
      vm.paths = _paths
    }

    // debug('CATEGORIES callback %o %o', _hosts_paths, _categories)
  }
}

const once = [
  os_hosts_paths
]

const periodical = [
  os_hosts_paths,
]

const requests = {
  periodical: periodical,
  once: once
}

export { periodical, once }
export default requests
