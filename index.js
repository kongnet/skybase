const start = require('./lib/sky')
const createIoredis = require('./sky-module/create_ioredis')
const createRbmq = require('./sky-module/create_amqplib')
const createKafka = require('./sky-module/create_kafka.js')

module.exports = {
  start,
  createIoredis,
  createRbmq,
  createKafka
}
