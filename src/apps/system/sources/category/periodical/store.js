import * as Debug from 'debug'
const debug = Debug('apps:system:sources:category:periodical:store')

// const nginx_os_enabled = {
//   params: {
//     path: 'all',
//     query: {
//       'from': 'os',
//       'index': false,
//       'q': [
//         'data',
//         { 'metadata': ['category', 'timestamp', 'path'] }// timestamp give us last update
//       ]
//       // 'filter': [ { 'metadata': { 'path': 'os.nginx.enabled' } } ]
//     }
//   },
//   callback: function (tables, metadata, key, vm) {
//     debug('STORE callback', tables, this)
//     this.some_data.test = false
//   }
// }

const store = []

// export { periodical, once, nginx_os_error }
export default store
