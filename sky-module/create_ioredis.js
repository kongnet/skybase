/* global $ */
const Redis = require('ioredis')
$.option.logTime = false
const connect = function (rd) {
  let hadConnected = false
  let connected

  // ioredis 的 auth 叫 password
  rd.password = rd.auth

  const redis = new Redis(rd)

  // ioredis 自动重连出错时：
  redis.reconnectOnError = function (err) {
    redis.connStatus = { stat: 0 }
    $.err($.c.r('✘'), `-x- Redis [${$.c.yellow}${rd.host} : ${rd.port}${$.c.none}] disconnect...`)
    $.err('redis连接失败原因：', err.code, err.message)
    return false // 返回true或1才会重新启动
  }
  redis.on('connect', function () {
    redis.connStatus = { stat: 1 }
    redis.dbsize().then(function (_r) {
      _r = _r || 0
      $.log($.c.g('✔'), `Redis [${$.c.yellow}${rd.host} : ${rd.port}${$.c.none}] db ${$.c.yellow}${rd.db}${$.c.none} [${$.c.yellow}${_r}${$.c.none}] Objects`)

      hadConnected = true
      connected && connected()
    })
  })
  redis.on('error', function (e) {
    $.err($.c.r('✘'), `-x- Redis [${$.c.yellow}${rd.host} : ${rd.port}${$.c.none}] ${e.toString()}`)
  })

  redis.waitForConnected = () => new class {
    then (fn) {
      if (hadConnected) {
        fn()
      } else {
        connected = fn
      }
    }
  }()

  return redis
}

module.exports = connect
