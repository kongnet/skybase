const sky = require('../../index')
const config = require('./config')
const $ = require('meeko')

config.beforeMount = async () => {
  // 连接mysql
  const db = require('j2sql')(config.mysql)
  await $.tools.waitNotEmpty(db, '_mysql')
  global.db = db
  /*
  // 连接mysql主
  const dbMain = require('j2sql')(config.mysqlMain)
  await $.tools.waitNotEmpty(dbMain, '_mysql')
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
  global.Kafka = await createKafka(config.kafka) */
}

sky.start(config, async () => {
  console.log('项目成功启动')
})
