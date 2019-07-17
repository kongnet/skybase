#!/usr/bin/env node
'use strict'
const $G = global.$G = global.$G || {}
// global.Promise = require('bluebird')
const skyExt = require('./sky_extend')
const path = require('path')
// 全局对象
const $ = global.$ = require('meeko')
$.option.logTime = false

$G.cache = { len: 0 }

const config = $G.config = require('../config')

// 把server设为全局，就是 koa.listen 返回的那个
$G.server = false

// copyright
skyExt.artTxt('SKY')

let app
const initKoa = () => {
  // koa设置
  if (app) {return app}
  app = new (require('koa'))()
  app.keys = ['kongxiangfeng', 'kongxiangfeng sky']
  app.context.throwCode = skyExt.ctx.throwCode
  app.context.ok = skyExt.ctx.ok

  return app
}

const getPort = async (port, beforeListenPort) => {
  // 侦听端口
  let portTemp = port || 13000
  if (beforeListenPort) {
    const ret = await beforeListenPort(config, portTemp)
    if (typeof ret === 'number') {
      // eslint-disable-next-line require-atomic-updates
      portTemp = ret
    }
  }
  return portTemp
}

const createWebServer = (port) => {
  const server = app.listen(port)
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      $.err($.c.r('✘'), `:${port} 端口已被占用\n检查方式(仅供参考)：\nss -lntpd | grep :${port}\nlsof -i tcp:${port}`)
    } else {
      $.err($.c.r('✘'), '服务发送错误', {
        code: e.code,
        message: e.message
      })
    }
  })
  return server
}

async function init (option, cbFun) {
  Object.assign(config, option || {})

  const {
    name,
    port,

    beforeMount,
    beforeLoadMiddlewares,
    afterLoadMiddlewares,
    beforeListenPort,

    middlewares,
    rootDir,
    middlewareDir
  } = config

  if (beforeMount) {
    skyExt.artStage('beforeMount')
    await beforeMount(config)
  }

  // 加载中间件之前
  if (beforeLoadMiddlewares) {
    skyExt.artStage('beforeLoadMiddlewares')
    await beforeLoadMiddlewares(config)
  }

  /**
   * 启动中间件
   * */
  if (middlewares && middlewares.length) {
    initKoa()
    middlewares.forEach(middleware => {
      let mid
      if (/sky-.+/.test(middleware)) {
        try {
          mid = require(`./middleware/${middleware}`)
        } catch (e) {
          console.error(`加载中间件“${middleware}”失败`, e.stack)
          return
        }
      } else {
        try {
          mid = require(path.join(rootDir, middlewareDir, middleware))
        } catch (e) {
          console.error(`加载中间件“${middleware}”失败`, e.stack)
          return
        }
      }
      if (mid instanceof Array) {
        mid.forEach(m => {
          app.use(m)
        })
      } else {
        app.use(mid)
      }
    })
  }

  // 加载中间件之后
  if (afterLoadMiddlewares) {
    skyExt.artStage('afterLoadMiddlewares')
    await afterLoadMiddlewares(config)
  }

  try {
    if (middlewares && middlewares.length) {
      initKoa()
      app.on('error', function (e) {
        throw (e)
      })

      $.option.logTime = 0

      // 侦听端口
      const portFinal = await getPort(port, beforeListenPort)
      $G.server = createWebServer(portFinal)

      $.log($.c.g('✔'), `${$.c.y(name)} WebServer [${$.c.y('0.0.0.0')}] Listen at`, `${$.c.y(portFinal)}`)
      skyExt.artTxt(name, 'Larry 3D')
    }
    skyExt.artStage('program Starting')
    cbFun(config)
  } catch (e) {
    $.err(e.stack)
  }
}

module.exports = init
