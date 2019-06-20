const sky = require('../../index')
const config = require('./config')
const $ = require('meeko')

const createIoredis = require('../../sky-module/create_ioredis')
const createRbmq = require('../../sky-module/create_amqplib')
const createKafka = require('../../sky-module/create_kafka.js')

async function waitNotEmpty (o, prop, fn) {
  fn = fn || function () {}
  if (!o[prop]) {
    fn(o, prop)
    await $.wait(100)
    await waitNotEmpty(o, prop, fn)
  }
}

config.beforeMount = async () => {
  // 连接mysql
  const db = require('j2sql')(config.mysql)
  await waitNotEmpty(db, '_mysql')
  global.db = db

  // 连接mysql主
  const dbMain = require('j2sql')(config.mysqlMain)
  await waitNotEmpty(dbMain, '_mysql')
  global.dbMain = dbMain

  // 连接redis
  const redis = createIoredis(config.redis)
  await redis.waitForConnected()
  global.redis = redis

  // 连接redis主
  const redisMain = createIoredis(config.redisMain)
  await redis.waitForConnected()
  global.redisMain = redisMain

  // 连接mq
  global.MQ = await createRbmq(config.rabbitMQ)

  // 连接kafka
  global.Kafka = await createKafka(config.kafka)
}

sky.start(config, async () => {
  console.log('项目成功启动')
})
