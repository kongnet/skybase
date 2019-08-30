
const queueName = 'test'

module.exports = {
  async api1 (ctx) {
    const { msg } = ctx.checkedData.data
    const ch = await global.MQ.createChannel()
    await ch.assertQueue(queueName, {})
    const res = await ch.sendToQueue(queueName, Buffer.from(JSON.stringify({
      msg: msg
    })))

    if (res) {
      ctx.ok()
    } else {
      ctx.throwCode(0, '出错了')
    }
  }
}
