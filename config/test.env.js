var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_BASE_URL: '"http://void.dev/"',
  REALTIME_SERVICE_WSS: '"wss://realtime-crystal.herokuapp.com/subscribe"',
})
