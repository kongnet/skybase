const $ = require('meeko')
const kafka = require('kafka-node')
const HighLevelProducer = kafka.HighLevelProducer
const Client = kafka.KafkaClient
$.option.logTime = false
module.exports = async (kafkaConfig) => {
  try {
    let client = new Client({ kafkaHost: kafkaConfig.host })
    const producer = new HighLevelProducer(client)

    producer.on('ready', function () {
      $.log($.c.g('✔'), `Kafka [${$.c.y(kafkaConfig.host)}]`)
    })

    producer.on('error', function (e) {
      $.err($.c.r('✘'), `-x- Kafka [${$.c.y(kafkaConfig.host)}] disconnect...`)
    })
    return producer
  } catch (e) {
    $.err($.c.r('✘'), `-x- Kafka [${$.c.y(kafkaConfig.host)}] disconnect...`)
    console.error(e.stack)
  }
  return null
}
