const sky = require('../../index')
const config = require('./config')
const $ = require('meeko')

const createIoredis = require('../../sky-module/create_ioredis')

async function waitNotEmpty (o, prop, fn) {
  fn = fn || function () {}
  if (!o[prop]) {
    fn(o, prop)
    await $.wait(100)
    await waitNotEmpty(o, prop, fn)
  }
}

config.beforeMount = async () => {
  // 连接redis
  const redis = createIoredis(config.redis)
  await redis.waitForConnected()
  global.redis = redis

  // 连接mysql
  const db = require('j2sql')(config.mysql)
  await waitNotEmpty(db, '_mysql')
  global.db = db
}

sky.start(config, async () => {
  console.log('项目成功启动')
})
