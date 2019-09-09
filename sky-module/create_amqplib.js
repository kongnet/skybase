/**
 * rabbit_mq 连接器，带断开自动重连功能
 * */

const $ = require('meeko')
const amqp = require('amqplib')
$.option.logTime = false

/**
 * 给MQ加一些必须的监听器，包括处理重新连接的逻辑
 * */

const addListener = (mq, conf, onReconnected) => {
  mq.on('close', async (e) => {
    // 启动后，断开了连接
    $.err($.c.r('✘'), `-x- rabbitMQ [${$.c.y(`${conf.hostname} : ${conf.port}`)}] close...`)
    $.err(e.message)

    if (onReconnected) {
      const MQ = await createAmqp(conf, onReconnected)
      $.log($.c.g('✔'), `rabbitMQ [${$.c.y(`${conf.hostname} : ${conf.port}`)}]`)
      onReconnected && onReconnected(MQ)
    }
  })

  mq.on('error', function (e) {
    $.err($.c.r('✘'), `-x- rabbitMQ [${$.c.y(`${conf.hostname} : ${conf.port}`)}] disconnect...`)
    $.err(e.message)
  })
}

/**
 * 创建并连接队列
 * @param conf 配置
 * @param {function(ChannelModel)} onReconnected 重连成功之后执行的方法
 * 重连之后，整个MQ实例都会换掉（amqplib就有这个坑），如果是消费者，重连之后必须重新注册，否则即使重连了，也接收不到数据了
 *
 * @return {Promise<ChannelModel>}
 * */

const createAmqp = async (conf, onReconnected) => {
  const option = {
    protocol: conf.protocol,
    hostname: conf.host,
    port: conf.port,
    username: conf.login,
    password: conf.password,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 7,
    vhost: conf.vhost,
  }

  let err = false
  do {
    try {
      const MQ = await amqp.connect(option)
      addListener(MQ, option, onReconnected)
      $.log($.c.g('✔'), `rabbitMQ [${$.c.y(`${option.hostname} : ${option.port}`)}]`)
      return MQ
    } catch (e) {
      $.err($.c.r('✘'), `-x- rabbitMQ [${$.c.y(`${option.hostname} : ${option.port}`)}] connected fail...`)
      $.err(e.stack)
      err = true
      await $.wait(2000)
    }
  } while (err)
  return false
}

module.exports = createAmqp
