/**
 * 队列消费者
 *
 * 启动方式： node ./demo/3-full-module/rabbit-consumer.js
 * */

'use strict'

// 在windows上设置这个环境麻烦，所以只要是没设置的，就认为是本地环境
process.env.NODE_ENV = process.env.NODE_ENV || process.argv[2] || 'local'

const $ = require('meeko')

const queueName = 'test'

const config = require('./config')
const createRbmq = require('../../sky-module/create_amqplib')
let MQ

async function before () {
  MQ = await createRbmq(config.rabbitMQ, (mq) => {
    MQ = mq
    start().then()
  })
  console.log('mq加载完成')
}

async function start () {
  const ch = await MQ.createChannel()
  await ch.assertQueue(queueName, {})
  await ch.consume(queueName, async function (msg) {
    const data = msg.content.toString()
    console.log('data receive:', data)
  }, {
    // 这个设为false，则处理完之后必须使用 ch.ack(msg)
    noAck: true
  })

  $.log(`listening queue: ${queueName}`)
}

before().then(start).catch(async (err) => {
  console.error('致命错误', err.stack)
  process.exit(1)
})
