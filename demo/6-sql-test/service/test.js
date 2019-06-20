/**
 * @author: cuiguanghao
 * @date: 2019年06月10日08:37:23
 * @name: api.js
 * @description: 生成api文档
 */

/* global $ db dbMain redis redisMain MQ Kafka */

const Package = require('../package.json')

module.exports = {
  one,
  two,
  three,
  four
}

async function four (arg) {
  // mq 列队
  let mqSend = await sendQueueMsg('moneyLog', 'test mq ' + new Date().date2Str())
  let kafkaSend = await sendKafka('test', 'test kafka ' + new Date().date2Str())
  return { code: 0, data: { name: 'four', mqSend, kafkaSend } }
}

// 往kafka送消息
async function sendKafka (topic, msg) {
  if (!Kafka) {
    $.err(`sendKafka Not Conn topic=${topic} msg=${msg}`)
    return false
  }
  return new Promise(function (resolve) {
    Kafka.send([{ topic, msg }], function (err, result) {
      if (err) {
        $.err(err.stack)
        resolve(false)
      }
      // $.log(result, msg)
      resolve(true)
    })
  })
}

// 发送一个mq队里
async function sendQueueMsg (queueName, msg) {
  if (!MQ) {
    $.err(`SendQueueMsg Not Conn queueName=${queueName} msg=${msg}`)
    return
  }
  // https://github.com/squaremo/amqp.node/blob/master/examples/send_generators.js
  const ch = await MQ.createConfirmChannel()
  await ch.assertQueue(queueName)
  let r = ch.sendToQueue(queueName, Buffer.from(msg))
  await ch.waitForConfirms()
  ch.close()
  return r
}

async function three (arg) {
  let r = await redis.get(`${Package.name}:${arg.name}`)
  let rM = await redisMain.get(`${Package.name}:${arg.name}`)
  $.log(r, rM)
  return {
    code: 0,
    data: {
      redis: r,
      redisMain: rM
    }
  }
}

async function two (arg) {
  let r = await redis.set(`${Package.name}:${arg.name}`, 'redis ' + new Date().date2Str())
  let rM = await redisMain.set(`${Package.name}:${arg.name}`, 'redisMain ' + new Date().date2Str())
  $.log(r, rM)
  return {
    code: 0,
    data: {
      redis: r,
      redisMain: rM
    }
  }
}

async function one (arg) {
  let r = await db.admin_user.R({ d_flag: 0 }, {}, {}, 1).run()
  let rM = await dbMain.admin_user.R({ d_flag: 0 }, {}, {}, 1).run()
  $.log(r, rM)
  return {
    code: 0,
    data: {
      db: r,
      dbMain: rM
    }
  }
}
