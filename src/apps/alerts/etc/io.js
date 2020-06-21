'use strict'
const App = require('node-app-socket.io-client/index')
import DefaultConn from '@etc/default.io'

// let _app = new App(Object.merge(DefaultConn, { path: '/' }))
// export default _app.io

export default function () {
  if (Array.isArray(DefaultConn)) {
    let ios = []
    Array.each(DefaultConn, function (conn) {
      let _app = new App(Object.merge(conn, { path: '/' }))
      ios.push(_app.io)
    })

    return ios
  } else {
    let _app = new App(Object.merge(DefaultConn, { path: '/' }))
    return _app.io
  }
}
