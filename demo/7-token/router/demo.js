
/* global $ redis */

const Config = require('../../../config.js')
const Crypto = require('crypto')
const tokenSaveTime = 3600 * 5 // redis 数据缓存保留时间 单位：秒

module.exports = {
  async login (ctx) {
    const { account, password } = ctx.checkedData.data
    let token = await setToken({ id: 1, account, password })
    ctx.throwCode(200, '成功', { token })
  },
  async home (ctx) {
    ctx.throwCode(200, '成功', ctx.checkedToken)
  }
}

// 创建token 以id 并且设定用户数据
async function setToken (obj) { // obj - 存放对象
  try {
    let s = obj.id + ' ' + +new Date()
    let token = Crypto.createHmac('sha256', s.slice(0, 5)).update(s).digest('base64')
    let keyStr = Config.tokenName + ':userlogin:' + token
    if (await redis.setex(keyStr, tokenSaveTime, JSON.stringify(obj)) === 'OK') { // 保存2个小时
      // 删除原先的登录凭证
      await delOldToken(obj.id)
      // 设定新的登录凭证
      await redis.set(Config.tokenName + ':id:' + obj.id, token)
      return token
    }
    return -1
  } catch (e) {
    $.err(e)
    return -1
  }
}

// 删除原先的登录凭证
async function delOldToken (id) {
  let ot = await redis.get(Config.tokenName + ':id:' + id)
  if (ot && ot.length > 13) {
    await redis.del(Config.tokenName + ':userlogin:' + ot)
  }
}
