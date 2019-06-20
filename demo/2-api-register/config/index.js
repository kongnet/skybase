'use strict'
let $ = require('meeko')
const envMap = {
  dev: 'dev',
  development: 'dev',
  test: 'test',
  'local-test': 'local-test',
  checkout: 'checkout', // 是另一个测试环境，当时运维没命好名
  local: 'local',
  production: 'prod',
  prod: 'prod'
}

let env = process.env.NODE_ENV

// 有这个之后，启动时 node .\index.js local 即可指定环境
if (!env && process.argv[2]) {
  env = process.argv[2]
}

env = envMap[env] || 'local'
const defConfig = require('./config.default')

let config = {}
try {
  config = require('./config.' + env)
} catch (e) {
  console.log('\x1b[2;31m' + `【普通错误】${env}配置文件缺失，将使用default配置` + '\x1b[m')
}
$.option.logTime = 0
$.log(`=======================\n   NODE_ENV:${$.c.g(` ${env}  `)}  \n=======================`)
module.exports = { ...defConfig, ...config }
