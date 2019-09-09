const sky = require('../../index')
const config = require('./config')
const $ = require('meeko')
const Config = require('../../skyconfig.js')

const createIoredis = require('../../sky-module/create_ioredis')

config.beforeMount = async () => {
  // 连接redis
  const redis = createIoredis(config.redis)
  await redis.waitForConnected()
  global.redis = redis
}

sky.start(config, async () => {
  Config.tokenName = '7-token' // set redis save Token key name
  console.log('项目成功启动')
})
