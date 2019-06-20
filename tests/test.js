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

global.redis = createIoredis(require(`../demo/${projectName}/config`).redis)
global.db = require('j2sql')(require(`../demo/${projectName}/config`).mysql)

describe('测试', async () => {
  let port = 8080
  let url = `http://localhost:${port}`
  it(`1.启动项目 demo`, async () => {
    sky.start({
      port: port,
      rootDir: path.join(__dirname, `../demo/${projectName}`)
    }, async () => {
      console.log('项目成功启动')
    })

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

  await $.wait(1000)
  process.exit(0) // 测试结束退出
})
