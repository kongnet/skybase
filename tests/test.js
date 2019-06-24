'use strict'
/* global describe */
/* global it */
const assert = require('assert')
const path = require('path')
const request = require('request-promise-native')
const $ = require('meeko')
const sky = require('../index.js')
const createIoredis = require('../sky-module/create_ioredis')
const projectName = `8-test`
const Config = require(`../demo/${projectName}/config`)

describe('覆盖率测试', async () => {
  let port = 8090
  let url = `http://localhost:${port}`

  it(`1.启动项目 demo`, async () => {
    Config.beforeMount = async () => {
      const redis = createIoredis(Config.redis)
      await redis.waitForConnected()
      global.redis = redis

      createIoredis({ host: 'localhost', port: 6380, db: 1 })

      const db = require('j2sql')(Config.mysql)
      await waitNotEmpty(db, '_mysql')
      global.db = db
    }

    Config.port = port
    Config.rootDir = path.join(__dirname, `../demo/${projectName}`)

    Config.beforeLoadMiddlewares = async () => { }
    Config.afterLoadMiddlewares = async () => { }
    Config.beforeListenPort = async () => {
      return port
    }

    sky.start(Config, async () => {
      console.log('项目成功启动')
    })

    await $.wait(500)
    let r = await request(`${url}`)
    let obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '接口不存在')
    assert.strictEqual(obj.code, 404)
  })

  it(`2.mock模块测试`, async () => {
    let r = await request(`${url}/mock/noControllerNoMock`)
    let obj = JSON.parse(r)
    assert.strictEqual(obj.data, 'controller未定义 & mock未定义')
    assert.strictEqual(obj.msg, 'ok')
    assert.strictEqual(obj.code, 200)

    r = await request(`${url}/mock/noController`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, 'ok')
    assert.strictEqual(obj.code, 200)

    r = await request(`${url}/mock/haveController`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, 'ok')
    assert.strictEqual(obj.code, 200)

    r = await request(`${url}/mock/image`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, 'ok')
    assert.strictEqual(obj.code, 200)
  })

  it(`3.登录模块测试`, async () => {
    let r = await request(`${url}/demo/login`)
    let obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '账号 必填')
    assert.strictEqual(obj.code, 400)

    let account = 'testAccount'
    let password = 'TestPassword'
    r = await request(`${url}/demo/login?account=${account}`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '密码 必填')
    assert.strictEqual(obj.code, 400)

    r = await request(`${url}/demo/login?account=${account}&password=${password}`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '成功')
    assert.strictEqual(obj.code, 200)

    await request(`${url}/demo/home`)

    await request({ url: `${url}/demo/home`, headers: { token: 'test' } })

    await request({ url: `${url}/demo/home`, headers: { token: obj.data.token } })
  })

  it(`4.数据库模块测试`, async () => {
    let r = await request(`${url}/one`)
    let obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '成功')
    assert.strictEqual(obj.code, 200)
    assert.strictEqual(obj.data.db.length, 1)

    r = await request({ url: `${url}/dir/two`, method: 'post' })
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '你的名字 必填')
    assert.strictEqual(obj.code, 400)

    r = await request({ url: `${url}/dir/two`, method: 'post', formData: { name: 'test two' } })
    obj = JSON.parse(r)
    assert.strictEqual(obj.msg, '成功')
    assert.strictEqual(obj.data.redis, 'OK')
    assert.strictEqual(obj.code, 200)
  })

  it(`5.错误例子和特殊情况`, async () => {
    let r = await request(`${url}/testErrCode`)
    let obj = JSON.parse(r)
    assert.strictEqual(obj.code, 500)

    r = await request(`${url}/testErrCodeArr`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.code, 200)

    r = await request(`${url}/testErrCodeObj`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.code, 500)

    r = await request(`${url}/testErrCodeErr`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.code, 500)

    r = await request(`${url}/testErr`)
    obj = JSON.parse(r)
    assert.strictEqual(obj.code, 500)

    let largeName = 'test'
    for (let i = 0; i < 23; i++) { largeName += largeName }
    await request({ url: `${url}/dir/two`, method: 'post', formData: { name: largeName } })

    await request({ url: `${url}/dir/two`, method: 'put', formData: { name: 'test' } })

    global.coreConfig = { apiChange: { 'swagger-ui.html': '/one' } }
    await request({ url: `${url}/swagger-ui.html`, method: 'get', formData: { name: 'test' } })

    await request({ url: `${url}/dir/two`, method: 'get', formData: { name: 'largeName' } })

    global.$G.cache['get/one'] = 'test'
    await request({ url: `${url}/one` })
    delete global.$G.cache['get/one']

    global.redis.reconnectOnError({ code: 400, message: 'test' })
  })

  it(`6.启动空项目`, async () => {
    sky.start(null, async () => {
      console.log('项目成功启动')
    })
  })

  await $.wait(1000)
  process.exit(0) // 测试结束退出
})

async function waitNotEmpty (o, prop, fn) {
  fn = fn || function () {}
  if (!o[prop]) {
    fn(o, prop)
    await $.wait(100)
    await waitNotEmpty(o, prop, fn)
  }
}
